package py.juancito.consultaelectoral

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import org.json.JSONArray
import org.json.JSONObject
import java.text.Normalizer

class MainActivity : Activity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        webView = WebView(this)
        setContentView(webView)

        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.loadWithOverviewMode = true
        webView.settings.useWideViewPort = true
        webView.settings.allowFileAccess = true
        webView.webChromeClient = WebChromeClient()
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val uri = request.url
                return if (uri.scheme == "https" || uri.scheme == "geo") {
                    startActivity(Intent(Intent.ACTION_VIEW, uri))
                    true
                } else false
            }
        }
        webView.addJavascriptInterface(PadronBridge(), "AndroidPadron")
        webView.loadUrl("file:///android_asset/index.html")
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    inner class PadronBridge {
        private val voters: List<JSONObject> by lazy {
            assets.list("padron").orEmpty().sorted().flatMap { fileName ->
                val json = assets.open("padron/$fileName").bufferedReader(Charsets.UTF_8).use { it.readText() }
                val chunk = JSONArray(json)
                (0 until chunk.length()).map { chunk.getJSONObject(it) }
            }
        }

        private fun normalized(value: String): String = Normalizer.normalize(value, Normalizer.Form.NFD)
            .replace(Regex("\\p{M}+"), "")
            .uppercase()
            .trim()
            .replace(Regex("\\s+"), " ")

        private fun mask(value: String): String {
            val clean = value.filter(Char::isDigit)
            return "•".repeat(maxOf(3, clean.length - 3)) + clean.takeLast(3)
        }

        private fun publicResult(voter: JSONObject): JSONObject {
            val fullName = "${voter.optString("nombre")} ${voter.optString("apellido")}".trim().replace(Regex("\\s+"), " ")
            val place = voter.optString("des_loc")
            return JSONObject().apply {
                put("id", voter.optString("nroreg"))
                put("fullName", fullName)
                put("maskedDocument", mask(voter.optString("numero_ced")))
                put("pollingPlaceName", place)
                put("district", voter.optString("desc_sec", "PIRIBEBUY"))
                put("table", voter.optString("mesa"))
                put("orderNumber", voter.optString("orden"))
                put("mapsUrl", "https://www.google.com/maps/search/?api=1&query=" + Uri.encode("$place, Piribebuy, Paraguay"))
            }
        }

        @JavascriptInterface
        fun search(documentNumber: String, fullName: String): String {
            val output = JSONArray()
            val document = documentNumber.filter(Char::isDigit)
            val terms = normalized(fullName).split(" ").filter { it.isNotBlank() }
            for (voter in voters) {
                val matches = if (document.isNotBlank()) {
                    voter.optString("numero_ced").filter(Char::isDigit) == document
                } else {
                    val candidate = normalized("${voter.optString("nombre")} ${voter.optString("apellido")}")
                    terms.isNotEmpty() && terms.all(candidate::contains)
                }
                if (matches) output.put(publicResult(voter))
                if (document.isNotBlank() && output.length() == 1) break
                if (output.length() == 20) break
            }
            return output.toString()
        }
    }
}
