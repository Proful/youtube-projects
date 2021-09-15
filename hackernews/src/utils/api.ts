import { Story } from "../types"

export const HN_HOST = "https://hacker-news.firebaseio.com/v0"

export const fetchTopStoriesIds = async (): Promise<number[]> => {
  const response = await fetch(`${HN_HOST}/topstories.json`)
  const topStoriesIds = await response.json()
  // console.log(topStoriesIds)
  return topStoriesIds
}

export const fetchStory = async (id: number): Promise<Story> => {
  const response = await fetch(`${HN_HOST}/item/${id}.json`)
  const storyData = await response.json()
  // console.log(storyData)

  const story: Story = {
    id: storyData.id,
    by: storyData.by,
    title: storyData.title,
    url: storyData.url,
  }
  // console.log(story)
  return story
}

export const fetchStories = async (ids: number[]): Promise<Story[]> => {
  const stories: Story[] = await Promise.all(ids.map(fetchStory))

  // console.log(stories)
  return stories
}
// fetchTopStoriesIds()
// fetchStory(28507350)
// fetchStories([28507350, 28508497])
