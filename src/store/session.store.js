import { fetchFromAPI } from '@/lib/api'
import { create } from 'zustand'

const useProfileStore = create((set) => ({
  profile: null,
  
  setProfile: (profile) => set({ profile }),
  
  refreshProfile: async () => {
    try {
      const response = await fetchFromAPI('/get-profile')
      
      set({ profile: response })
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  },

  clearProfile: () => set({ profile: null })
}))

export default useProfileStore
