function getPhotographerIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}
