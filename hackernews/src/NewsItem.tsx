import React from "react"

type NewsItemProps = {
  id: number
  title: string
  url: string
  index: number
}

export function NewsItem({ index, id, title, url }: NewsItemProps) {
  return (
    <div className="mb-12">
      <div>
        <a
          className="cursor-pointer text-3xl"
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {index}. {title}
        </a>
      </div>
      <div className={`${index < 10 ? "ml-8" : "ml-11"} text-xl text-gray-500`}>
        <span>({new URL(url).hostname})</span>
        <span> | </span>
        <span>
          <a
            className="cursor-pointer hover:underline"
            href={`https://news.ycombinator.com/item?id=${id}`}
            target="_blank"
            rel="noreferrer"
          >
            comments
          </a>
        </span>
      </div>
    </div>
  )
}
