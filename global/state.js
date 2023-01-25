import { createGlobalState } from "react-hooks-global-state"

const {setGlobalState, useGlobalState} = createGlobalState({
  showType: "movie"
})

export { useGlobalState, setGlobalState }