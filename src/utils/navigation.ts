import { useRouter } from 'vue-router'

export function useSafeBack() {
  const router = useRouter()

  return () => {
    router.back()
    // if (window.history.length > 1) {
    // } else {
    //   router.replace('/hot')
    // }
  }
}
