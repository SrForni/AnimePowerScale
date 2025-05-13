import { NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function GET() {
  const url = "https://www.animenewsnetwork.com/"
  const cdnBase = "https://cdn.animenewsnetwork.com"

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    })

    if (!res.ok) {
      console.error("❌ No se pudo obtener la página")
      return NextResponse.json({ error: "No se pudo obtener la página" }, { status: 500 })
    }

    const html = await res.text()
    const $ = cheerio.load(html)

    const noticias = $("#topfeed .herald.box.news").map((i, el) => {
      const title = $(el).find("h3 a").text().trim()
      const content =
        $(el).find(".snippet .full").text().trim() ||
        $(el).find(".snippet .hook").text().trim()

      const href = $(el).find("h3 a").attr("href")
      const urlCompleta = href ? `https://www.animenewsnetwork.com${href}` : undefined

      const dateText = $(el).find("time").attr("datetime") || new Date().toISOString()
      const date = dateText.split("T")[0]

      const dataSrc = $(el).find(".thumbnail").attr("data-src")
      const imageUrl = dataSrc ? `${cdnBase}${dataSrc}` : undefined

      return {
        id: i,
        title,
        content,
        date,
        imageUrl,
        category: "announcement",
        link: urlCompleta,
      }
    }).get()

    console.log(`📰 Total de noticias obtenidas: ${noticias.length}`)
    return NextResponse.json({ noticias })
  } catch (error) {
    console.error("⨯ Error al scrapear noticias:", error)
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 })
  }
}
