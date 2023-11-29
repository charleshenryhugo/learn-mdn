// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy

const myGroupBy = (items, callbackFn) => {
  const groupedItems = {}

  items.forEach((item, index) => {
    const key = callbackFn(item, index)

    if (!!groupedItems[key]) {
      groupedItems[key].push(item)
    } else {
      groupedItems[key] = [item]
    }
  })

  return groupedItems
}

/* test */
const inventory = [
  { name: "asparagus", type: "vegetables", quantity: 5 },
  { name: "bananas", type: "fruit", quantity: 0 },
  { name: "goat", type: "meat", quantity: 23 },
  { name: "cherries", type: "fruit", quantity: 5 },
  { name: "fish", type: "meat", quantity: 22 },
]

const groupedInventory = myGroupBy(inventory, (item) => item.quantity > 10 ? 'many' : 'few')

console.log(groupedInventory)