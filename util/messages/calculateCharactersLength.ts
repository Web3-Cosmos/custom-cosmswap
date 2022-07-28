export function calculateCharactersLength(value: string) {
  var count = {
    symbols: 0,
    dotLikeSymbols: 0,
  }
  value.split('').forEach(function (symbol) {
    if (symbol.match(/\.|\,/)) {
      count.dotLikeSymbols += 1
    } else {
      count.symbols += 1
    }
  })
  return count.symbols + count.dotLikeSymbols * 0.3
}
