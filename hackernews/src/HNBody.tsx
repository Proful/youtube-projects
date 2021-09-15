import React, { useState, useEffect } from "react"
import { Story } from "./types"
import { NewsItem } from "./NewsItem"
import { fetchStories, fetchTopStoriesIds } from "./utils/api"

export function HNBody() {
  const [topStoriesIds, setTopStoriesIds] = useState([] as number[])
  const [stories, setStories] = useState([] as Story[])
  const [page, setPage] = useState(0)

  const loadStories = async () => {
    const topStoriesIdsData = await fetchTopStoriesIds()
    setTopStoriesIds(topStoriesIdsData)
    const storiesData = await fetchStories(topStoriesIdsData.slice(0, 10))
    setStories(storiesData)
  }

  useEffect(() => {
    loadStories()
  }, [])

  const loadMore = async () => {
    const storiesData = await fetchStories(
      topStoriesIds.slice(page + 10, page + 20)
    )
    setStories([...stories, ...storiesData])
    setPage(page + 10)
  }

  return (
    <div className="pl-48 pt-24 bg-white border-b-8 border-gray-50">
      {stories.map((it, index) => (
        <NewsItem
          key={it.id}
          id={it.id}
          index={index}
          title={it.title}
          url={it.url}
        />
      ))}
      <button
        type="button"
        onClick={loadMore}
        className="border border-gray-400 px-4 py-3 bg-gray-50 text-gray-800 rounded-sm mb-12 ml-8"
      >
        Load more
      </button>
    </div>
  )
}
