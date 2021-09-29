import React from "react"

type NewsItemProps = {
  id: number
  title: string
  url: string
  index: number
}

export function NewsItem({ id, title, url, index }: NewsItemProps) {
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
      <div className="ml-8 text-xl text-gray-500">
        <span>({new URL(url).hostname})</span>
        <span> | </span>
        <span>
          <a
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