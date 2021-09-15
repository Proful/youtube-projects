import React, { useEffect, useState } from "react"
import { HNHeader } from "./HNHeader"
import { HNBody } from "./HNBody"

export function HNHomePage() {
  return (
    <div>
      <HNHeader />
      <HNBody />
    </div>
  )
}
