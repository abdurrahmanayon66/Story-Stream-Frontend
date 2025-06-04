import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type TabType = 'For You' | 'Following' | 'Trending' | 'Latest' | 'Most Liked' | 'Explore';

export type BlogSortBy = 'latest' | 'oldest' | 'most_liked' | 'most_commented' | 'trending';

export interface BlogFilters {
  genre?: string[];
  search?: string;
  authorId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: any;
  image?: string;
  genre: string[];
  author: {
    id: number;
    name: string;
    username: string;
    image?: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
  comments: any[];
  likes: any[];
  bookmarks: any[];
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
}

export interface BlogConnection {
  blogs: Blog[];
  pagination: PaginationInfo;
}

interface BlogState {
  // Current active tab
  activeTab: TabType;
  
  // Blog data for each tab
  blogData: Record<TabType, BlogConnection | null>;
  
  // Loading states for each tab
  loading: Record<TabType, boolean>;
  
  // Error states for each tab
  errors: Record<TabType, string | null>;
  
  // Current filters and sorting
  filters: BlogFilters;
  sortBy: BlogSortBy;
  
  // Pagination settings
  currentPage: number;
  limit: number;
  
  // Search query
  searchQuery: string;
  
  // Actions
  setActiveTab: (tab: TabType) => void;
  setBlogData: (tab: TabType, data: BlogConnection) => void;
  setLoading: (tab: TabType, loading: boolean) => void;
  setError: (tab: TabType, error: string | null) => void;
  setFilters: (filters: Partial<BlogFilters>) => void;
  setSortBy: (sortBy: BlogSortBy) => void;
  setCurrentPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchQuery: (query: string) => void;
  
  // Utility actions
  clearBlogData: (tab?: TabType) => void;
  resetFilters: () => void;
  addBlogToTab: (tab: TabType, blog: Blog) => void;
  updateBlogInTab: (tab: TabType, blogId: number, updates: Partial<Blog>) => void;
  removeBlogFromTab: (tab: TabType, blogId: number) => void;
  
  // Get current tab data
  getCurrentTabData: () => BlogConnection | null;
  getCurrentTabLoading: () => boolean;
  getCurrentTabError: () => string | null;
}

const initialFilters: BlogFilters = {};

const initialBlogData: Record<TabType, BlogConnection | null> = {
  'For You': null,
  'Following': null,
  'Trending': null,
  'Latest': null,
  'Most Liked': null,
  'Explore': null,
};

const initialLoading: Record<TabType, boolean> = {
  'For You': false,
  'Following': false,
  'Trending': false,
  'Latest': false,
  'Most Liked': false,
  'Explore': false,
};

const initialErrors: Record<TabType, string | null> = {
  'For You': null,
  'Following': null,
  'Trending': null,
  'Latest': null,
  'Most Liked': null,
  'Explore': null,
};

export const useBlogStore = create<BlogState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        activeTab: 'For You',
        blogData: initialBlogData,
        loading: initialLoading,
        errors: initialErrors,
        filters: initialFilters,
        sortBy: 'latest',
        currentPage: 1,
        limit: 10,
        searchQuery: '',

        // Actions
        setActiveTab: (tab: TabType) => {
          set({ activeTab: tab, currentPage: 1 }, false, 'setActiveTab');
        },

        setBlogData: (tab: TabType, data: BlogConnection) => {
          set(
            (state) => ({
              blogData: { ...state.blogData, [tab]: data },
            }),
            false,
            'setBlogData'
          );
        },

        setLoading: (tab: TabType, loading: boolean) => {
          set(
            (state) => ({
              loading: { ...state.loading, [tab]: loading },
            }),
            false,
            'setLoading'
          );
        },

        setError: (tab: TabType, error: string | null) => {
          set(
            (state) => ({
              errors: { ...state.errors, [tab]: error },
            }),
            false,
            'setError'
          );
        },

        setFilters: (newFilters: Partial<BlogFilters>) => {
          set(
            (state) => ({
              filters: { ...state.filters, ...newFilters },
              currentPage: 1, // Reset to first page when filters change
            }),
            false,
            'setFilters'
          );
        },

        setSortBy: (sortBy: BlogSortBy) => {
          set({ sortBy, currentPage: 1 }, false, 'setSortBy');
        },

        setCurrentPage: (page: number) => {
          set({ currentPage: page }, false, 'setCurrentPage');
        },

        setLimit: (limit: number) => {
          set({ limit, currentPage: 1 }, false, 'setLimit');
        },

        setSearchQuery: (query: string) => {
          set(
            {
              searchQuery: query,
              filters: { ...get().filters, search: query || undefined },
              currentPage: 1,
            },
            false,
            'setSearchQuery'
          );
        },

        // Utility actions
        clearBlogData: (tab?: TabType) => {
          if (tab) {
            set(
              (state) => ({
                blogData: { ...state.blogData, [tab]: null },
                errors: { ...state.errors, [tab]: null },
              }),
              false,
              'clearBlogData'
            );
          } else {
            set(
              {
                blogData: initialBlogData,
                errors: initialErrors,
              },
              false,
              'clearAllBlogData'
            );
          }
        },

        resetFilters: () => {
          set(
            {
              filters: initialFilters,
              sortBy: 'latest',
              currentPage: 1,
              searchQuery: '',
            },
            false,
            'resetFilters'
          );
        },

        addBlogToTab: (tab: TabType, blog: Blog) => {
          set(
            (state) => {
              const currentData = state.blogData[tab];
              if (!currentData) return state;

              return {
                ...state,
                blogData: {
                  ...state.blogData,
                  [tab]: {
                    ...currentData,
                    blogs: [blog, ...currentData.blogs],
                    pagination: {
                      ...currentData.pagination,
                      totalCount: currentData.pagination.totalCount + 1,
                    },
                  },
                },
              };
            },
            false,
            'addBlogToTab'
          );
        },

        updateBlogInTab: (tab: TabType, blogId: number, updates: Partial<Blog>) => {
          set(
            (state) => {
              const currentData = state.blogData[tab];
              if (!currentData) return state;

              return {
                ...state,
                blogData: {
                  ...state.blogData,
                  [tab]: {
                    ...currentData,
                    blogs: currentData.blogs.map((blog) =>
                      blog.id === blogId ? { ...blog, ...updates } : blog
                    ),
                  },
                },
              };
            },
            false,
            'updateBlogInTab'
          );
        },

        removeBlogFromTab: (tab: TabType, blogId: number) => {
          set(
            (state) => {
              const currentData = state.blogData[tab];
              if (!currentData) return state;

              return {
                ...state,
                blogData: {
                  ...state.blogData,
                  [tab]: {
                    ...currentData,
                    blogs: currentData.blogs.filter((blog) => blog.id !== blogId),
                    pagination: {
                      ...currentData.pagination,
                      totalCount: Math.max(0, currentData.pagination.totalCount - 1),
                    },
                  },
                },
              };
            },
            false,
            'removeBlogFromTab'
          );
        },

        // Getters
        getCurrentTabData: () => {
          const state = get();
          return state.blogData[state.activeTab];
        },

        getCurrentTabLoading: () => {
          const state = get();
          return state.loading[state.activeTab];
        },

        getCurrentTabError: () => {
          const state = get();
          return state.errors[state.activeTab];
        },
      }),
      {
        name: 'blog-store',
        partialize: (state) => ({
          activeTab: state.activeTab,
          filters: state.filters,
          sortBy: state.sortBy,
          limit: state.limit,
          searchQuery: state.searchQuery,
        }),
      }
    ),
    { name: 'blog-store' }
  )
);