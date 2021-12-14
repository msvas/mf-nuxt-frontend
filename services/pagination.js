// Isso é um serviço global para ser reutilizado nas stores dos resources que
// forem implementadas paginação.
export default {
  getResourceByPageNumber(resourceUrl) {
    return $nuxt.$axios.get(resourceUrl)
  }
}
