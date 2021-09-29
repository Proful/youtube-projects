import React, { useEffect, useState } from "react"
import { NewsItem } from "./NewsItem"
import { Story } from "./types"
import { fetchStories, fetchTopStoriesIds} from "./utils/api"

export function HNBody() {
  const [stories, setStories] = useState([] as Story[])
  const [topStoriesIds, setTopStoriesIds] = useState([] as number[])

  const loadStories = async () => {
    const topStoriesIdsData = await fetchTopStoriesIds()
    setTopStoriesIds(topStoriesIdsData)
    const storiesData = await fetchStories(topStoriesIdsData.slice(0, 10))
    setStories(storiesData)
  }

  useEffect(() => {
    loadStories()
  }, [])

  return (
    <div className="pl-48 pt-24 bg-white border-b-8 border-gray-50">
      {stories.map((it, index) => (
          <NewsItem key={it.id} id={it.id} title={it.title} url={it.url} index={index}/>
      ))}
    </div>
  )
}