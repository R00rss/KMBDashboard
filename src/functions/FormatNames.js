export const capitalizeFirstLetterWord = (str) => (str.charAt(0).toUpperCase() + str.slice(1))
const capitalizeFirstLetterWords = (str) => {
  const str2 = str.toLowerCase();
  const separate_str = str2.split(" ")
  let auxstr = ""
  separate_str.forEach((word, key) => {
    if (key !== separate_str.length - 1) {
      auxstr += capitalizeFirstLetterWord(word) + " "
    } else {
      auxstr += capitalizeFirstLetterWord(word)
    }
  });
  return auxstr
}
export const capitalizeFirstLetterParagraph = (str) => {
  const str2 = str.toLowerCase();
  const separate_str = str2.split(" ")
  let auxstr = ""
  separate_str.forEach((word, key) => {

    if (key !== separate_str.length - 1) {
      if (key === 0) {
        auxstr += capitalizeFirstLetterWord(word) + " ";
      } else {
        auxstr += (word) + " "
      }
    } else {
      auxstr += (word)
    }
  });
  return auxstr
}

export default capitalizeFirstLetterWords