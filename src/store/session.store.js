import { fetchFromAPI } from '@/lib/api'
import { create } from 'zustand'

const useProfileStore = create((set) => ({
  profile: null,
  is_freelancer: false,
  is_super_admin: false,
  is_internal_admin: false,
  
  setProfile: (profile) => set({ profile }),
  
  refreshProfile: async () => {
    try {
      const response = await fetchFromAPI('/get-profile')
      
      // Calculate user type flags based on profile data
      const is_freelancer = response?.userType === 'freelancer'
      const is_super_admin = response?.is_super_admin === true
      const is_internal_admin = response?.userType === 'admin' && response?.is_super_admin !== true
      
      set({ 
        profile: response,
        is_freelancer,
        is_super_admin,
        is_internal_admin
      })
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  },

  clearProfile: () => set({ 
    profile: null,
    is_freelancer: false,
    is_super_admin: false,
    is_internal_admin: false
  })
}))

export default useProfileStore
