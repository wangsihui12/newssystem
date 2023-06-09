export const CollApsedReducer = (
  prevState = {
    isCollapsed: false
  },
  action
) => {
  //   console.log(action)
  let { type } = action
  switch (type) {
    case 'change_collasped':
      let newState = { ...prevState }
      newState.isCollapsed = !newState.isCollapsed
      return newState
    default:
      return prevState
  }
}
