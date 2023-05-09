function capitalize(str: string) {
  const words = str.split(' ');
  const newWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );

  return newWords.join(' ');
}

export { capitalize };
