<template>
  <div class="sk-forum">
    <!-- Header with gradient background -->
    <div class="forum-header">
      <div class="container">
        <div class="header-content">
          <h1>SK Community Hub</h1>
          <p>Connect, share, and grow with fellow SK members</p>
          <button class="new-post-btn" @click="showPostModal = true">
            <i class="fas fa-plus"></i> Create Post
          </button>
        </div>
      </div>
    </div>

    <div class="forum-container">
      <div class="forum-grid">
        <!-- Sidebar for filters -->
        <aside class="forum-sidebar">
          <div class="sidebar-section">
            <h3>Filter Posts</h3>
                      <div class="sidebar-section">
            <button class="refresh-btn" @click="refreshPosts" :disabled="isRefreshing">
              <i class="fas" :class="isRefreshing ? 'fa-spinner fa-spin' : 'fa-sync-alt'"></i>
              {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
            </button>
          </div>
            <div class="filter-tabs">
              <button 
                v-for="tab in tabs" 
                :key="tab.id" 
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

        </aside>

        <!-- Main content area -->
        <main class="forum-main">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search posts..." 
              v-model="searchQuery"
            >
          </div>

          <!-- Posts list -->
          <div class="posts-grid">
            <div 
              v-for="post in filteredPosts" 
              :key="post.id" 
              class="post-card"
              :class="{ 'featured-post': post.isFeatured }"
            >
              <div class="post-header">
                <div class="author-info">
                
                  <div>
                    <h4>{{ post.authorName }}</h4>
                    <span class="post-date">{{ formatDate(post.createdAt) }}</span>
                    <span v-if="post.isFeatured" class="featured-badge">
                      <i class="fas fa-star"></i> Featured
                    </span>
                  </div>
                </div>
                <div class="post-actions" v-if="post.authorId === currentUser?.uid || isAdmin">
                  <div class="dropdown">
                    <button class="dropdown-toggle" type="button">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a href="#" @click.prevent="editPost(post)"><i class="fas fa-edit"></i> Edit</a>
                      <a href="#" @click.prevent="deletePost(post.id)"><i class="fas fa-trash"></i> Delete</a>
                      <a 
                        href="#" 
                        v-if="isAdmin" 
                        @click.prevent="toggleFeatured(post)"
                      >
                        <i class="fas fa-star"></i> {{ post.isFeatured ? 'Unfeature' : 'Feature' }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="post-content">
                <h3 @click="togglePostExpansion(post.id)" class="post-title">
                  {{ post.title }}
                  <i 
                    class="fas" 
                    :class="{ 'fa-chevron-down': !post.expanded, 'fa-chevron-up': post.expanded }"
                  ></i>
                </h3>
                <div class="post-body" v-if="post.expanded">
                  <p>{{ post.content }}</p>
                  <div v-if="post.image" class="post-image">
                    <img :src="post.image" alt="Post image" @click="openImageModal(post.image)">
                  </div>
                </div>
              </div>
              
              <div class="post-footer">
                <div class="post-stats">
                  <span class="likes" @click="toggleLike(post)">
                    <i class="fas" :class="{ 'fa-heart liked': post.likes?.includes(currentUser?.uid), 'fa-heart': !post.likes?.includes(currentUser?.uid) }"></i>
                    {{ post.likes?.length || 0 }}
                  </span>
                  <span class="comments" @click="toggleComments(post.id)">
                    <i class="fas fa-comment"></i>
                    {{ post.comments?.length || 0 }}
                  </span>
                </div>
                
                <div class="post-tags" v-if="post.tags?.length">
                  <span v-for="tag in post.tags" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
              
              <!-- Comments section -->
              <div class="comments-section" v-if="post.showComments">
                <div class="comment-list">
                  <div v-for="comment in post.comments" :key="comment.id" class="comment">
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-author">{{ comment.authorName }}</span>
                        <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                        <button 
                          v-if="comment.authorId === currentUser?.uid || isAdmin" 
                          class="delete-comment"
                          @click="deleteComment(post.id, comment.id)"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                      <p>{{ comment.content }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="add-comment">
                  <div class="comment-input">
                    <input 
                      type="text" 
                      placeholder="Write a comment..." 
                      v-model="newComments[post.id]"
                      @keyup.enter="addComment(post.id)"
                    >
                    <button @click="addComment(post.id)">
                      <i class="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Loading skeleton -->
            <div v-if="loadingPosts" class="posts-loading">
              <div v-for="n in 3" :key="n" class="post-skeleton">
                <div class="skeleton-header">
                  <div class="skeleton-avatar"></div>
                  <div class="skeleton-author"></div>
                </div>
                <div class="skeleton-title"></div>
                <div class="skeleton-content"></div>
                <div class="skeleton-content shorter"></div>
                <div class="skeleton-footer"></div>
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div class="empty-state" v-if="filteredPosts.length === 0 && !loadingPosts">
            <div class="empty-icon">
              <i class="fas fa-comments"></i>
            </div>
            <h3>No posts found</h3>
            <p>Try adjusting your search or be the first to create a post!</p>
            <button class="new-post-btn" @click="showPostModal = true">
              <i class="fas fa-plus"></i> Create First Post
            </button>
          </div>
          
          <!-- Load more button -->
          <div class="load-more" v-if="hasMorePosts && !loadingPosts && filteredPosts.length > 0">
            <button @click="loadMorePosts" :disabled="loadingMore">
              <i class="fas" :class="loadingMore ? 'fa-spinner fa-spin' : 'fa-arrow-down'"></i>
              {{ loadingMore ? 'Loading...' : 'Load More' }}
            </button>
          </div>
        </main>
      </div>
    </div>
    
    <!-- Modern Post Modal -->
    <transition name="modal">
      <div class="modal-overlay" v-if="showPostModal" @click.self="closePostModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ editingPost ? 'Edit Post' : 'Create New Post' }}</h2>
            <button class="close-btn" @click="closePostModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Title</label>
              <input type="text" v-model="newPost.title" placeholder="What's your post about?">
            </div>
            <div class="form-group">
              <label>Content</label>
              <textarea v-model="newPost.content" rows="5" placeholder="Share your thoughts..."></textarea>
            </div>
            <div class="form-group">
              <label>Tags (comma separated)</label>
              <input type="text" v-model="newPost.tags" placeholder="e.g., question, suggestion, announcement">
            </div>
          </div>
          <div class="modal-footer">
            <button class="cancel-btn" @click="closePostModal">Cancel</button>
            <button class="submit-btn" @click="savePost" :disabled="isSubmitting">
              {{ editingPost ? 'Update Post' : 'Publish Post' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- Image Modal -->
    <transition name="modal">
      <div class="image-modal-overlay" v-if="showImageModal" @click.self="showImageModal = false">
        <div class="image-modal-content">
          <button class="close-btn" @click="showImageModal = false">
            <i class="fas fa-times"></i>
          </button>
          <img :src="selectedImage" alt="Full size">
        </div>
      </div>
    </transition>
    
    <!-- Success Toast -->
    <transition name="toast">
      <div class="toast" v-if="showToast">
        <i class="fas fa-check-circle"></i>
        {{ editingPost ? 'Post updated successfully!' : 'Post published successfully!' }}
      </div>
    </transition>

    <!-- Floating action button -->
    <button class="fab" @click="showPostModal = true">
      <i class="fas fa-plus"></i>
    </button>

      <br>
  </div>


</template>


<script>
import { db, auth, storage } from '@/firebase/config';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  onSnapshot, query, orderBy, getDoc, getDocs,
  setDoc, arrayUnion, arrayRemove, serverTimestamp, 
  limit, startAfter 
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'SKForum',
  data() {
    return {
      searchQuery: '',
      activeTab: 'all',
      tabs: [
        { id: 'all', label: 'All Posts' },
        { id: 'featured', label: 'Featured' },
        { id: 'questions', label: 'Questions' },
        { id: 'announcements', label: 'Announcements' }
      ],
      posts: [],
      newComments: {},
      showPostModal: false,
      newPost: { 
        title: '', 
        content: '', 
        tags: '',
        image: null 
      },
      imagePreview: null,
      imageFile: null,
      editingPost: null,
      currentUser: null,
      isAdmin: false,
      skMembers: [],
      showToast: false,
      isSubmitting: false,
      currentSKMember: null,
      loadingPosts: false,
      loadingMore: false,
      hasMorePosts: true,
      lastVisiblePost: null,
      postsPerPage: 10,
      isRefreshing: false,
      showImageModal: false,
      selectedImage: null
    };
  },
  computed: {
    filteredPosts() {
      let posts = this.posts;
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(query) || 
          post.content.toLowerCase().includes(query) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      }
      switch (this.activeTab) {
        case 'featured':
          posts = posts.filter(post => post.isFeatured);
          break;
        case 'questions':
          posts = posts.filter(post => post.tags?.includes('question'));
          break;
        case 'announcements':
          posts = posts.filter(post => post.tags?.includes('announcement'));
          break;
      }
      return posts.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!b.isFeatured && b.isFeatured) return 1;
        return b.createdAt?.toDate() - a.createdAt?.toDate();
      });
    }
  },
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    },
    togglePostExpansion(postId) {
      this.posts = this.posts.map(post => ({
        ...post,
        expanded: post.id === postId ? !post.expanded : post.expanded
      }));
    },
    toggleComments(postId) {
      this.posts = this.posts.map(post => ({
        ...post,
        showComments: post.id === postId ? !post.showComments : post.showComments,
        expanded: post.id === postId ? true : post.expanded
      }));
      if (this.posts.find(p => p.id === postId).showComments) {
        this.loadComments(postId);
      }
    },
    async loadComments(postId) {
      const commentsQuery = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
      onSnapshot(commentsQuery, async snapshot => {
        const postIndex = this.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          const comments = await Promise.all(snapshot.docs.map(async doc => {
            const commentData = doc.data();
            const member = this.skMembers.find(m => m.userId === commentData.authorId);
            return {
              id: doc.id,
              ...commentData,
              authorName: member?.name || commentData.authorName || 'Anonymous'
            };
          }));
          this.posts[postIndex].comments = comments;
        }
      }, error => {
        console.error('Error loading comments:', error);
        alert('Failed to load comments. Please check your permissions.');
      });
    },
    async addComment(postId) {
      if (!this.currentUser || !this.currentSKMember || this.currentSKMember.status !== 'approved') {
        alert('Only approved SK members can comment.');
        return;
      }
      if (!this.newComments[postId]?.trim()) {
        alert('Please enter a comment.');
        return;
      }
      try {
        const comment = {
          content: this.newComments[postId].trim(),
          authorId: this.currentUser.uid,
          authorName: this.currentSKMember.name || 'Anonymous',
          authorPhoto: this.currentUser.photoURL || 'https://via.placeholder.com/40',
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, 'posts', postId, 'comments'), comment);
        this.newComments[postId] = '';
      } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment. Ensure you are an approved SK member.');
      }
    },
    async deleteComment(postId, commentId) {
      if (confirm('Are you sure you want to delete this comment?')) {
        try {
          await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
        } catch (error) {
          console.error('Error deleting comment:', error);
          alert('Failed to delete comment. You may not have permission.');
        }
      }
    },
    async savePost() {
      if (!this.currentUser || !this.currentSKMember || this.currentSKMember.status !== 'approved') {
        alert('Only approved SK members can create posts.');
        return;
      }
      if (!this.newPost.title.trim() || !this.newPost.content.trim()) {
        alert('Please fill in title and content.');
        return;
      }
      try {
        this.isSubmitting = true;
        const tags = this.newPost.tags 
          ? this.newPost.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag)
          : [];
        let imageUrl = null;
        if (this.imageFile) {
          const storageReference = storageRef(storage, `post_images/${Date.now()}_${this.imageFile.name}`);
          await uploadBytes(storageReference, this.imageFile);
          imageUrl = await getDownloadURL(storageReference);
        }
        const postData = {
          title: this.newPost.title.trim(),
          content: this.newPost.content.trim(),
          authorId: this.currentUser.uid,
          authorName: this.currentSKMember.name || 'Anonymous',
          authorPhoto: this.currentUser.photoURL || 'https://via.placeholder.com/40',
          createdAt: serverTimestamp(),
          likes: [],
          tags,
          image: imageUrl,
          isFeatured: this.editingPost?.isFeatured || false
        };
        if (this.editingPost) {
          if (!this.imageFile && this.editingPost.image) {
            postData.image = this.editingPost.image;
          }
          const postRef = doc(db, 'posts', this.editingPost.id);
          await updateDoc(postRef, postData);
        } else {
          const docRef = await addDoc(collection(db, 'posts'), postData);
          await this.notifySKMembers(postData.title, docRef.id);
        }
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
        this.closePostModal();
      } catch (error) {
        console.error('Error saving post:', error);
        alert('Failed to save post. Ensure you are an approved SK member.');
      } finally {
        this.isSubmitting = false;
      }
    },
    async notifySKMembers(postTitle, postId) {
      try {
        const members = this.skMembers.filter(m => m.userId !== this.currentUser.uid && m.status === 'approved');
        const batch = [];
        members.forEach(member => {
          const notification = {
            type: 'new_post',
            message: `New post in community: ${postTitle}`,
            read: false,
            userId: member.userId,
            createdAt: serverTimestamp(),
            link: `/forum/${postId}`
          };
          batch.push(addDoc(collection(db, 'notifications'), notification));
        });
        await Promise.all(batch);
      } catch (error) {
        console.error('Error notifying members:', error);
      }
    },
    async deletePost(postId) {
      if (confirm('Are you sure you want to delete this post? All comments will be lost.')) {
        try {
          const postRef = doc(db, 'posts', postId);
          const post = this.posts.find(p => p.id === postId);
          if (post.image) {
            const imageRef = storageRef(storage, post.image);
            await deleteObject(imageRef).catch(err => console.warn('Error deleting image:', err));
          }
          await deleteDoc(postRef);
        } catch (error) {
          console.error('Error deleting post:', error);
          alert('Failed to delete post. You may not have permission.');
        }
      }
    },
    async toggleLike(post) {
      if (!this.currentUser || !this.currentSKMember || this.currentSKMember.status !== 'approved') {
        alert('Only approved SK members can like posts.');
        return;
      }
      try {
        const postRef = doc(db, 'posts', post.id);
        const isLiked = post.likes?.includes(this.currentUser.uid);
        await updateDoc(postRef, {
          likes: isLiked 
            ? arrayRemove(this.currentUser.uid)
            : arrayUnion(this.currentUser.uid)
        });
      } catch (error) {
        console.error('Error toggling like:', error);
        alert('Failed to like/unlike post.');
      }
    },
    async toggleFeatured(post) {
      if (!this.isAdmin) {
        alert('Only admins can feature posts.');
        return;
      }
      try {
        const postRef = doc(db, 'posts', post.id);
        await updateDoc(postRef, { isFeatured: !post.isFeatured });
      } catch (error) {
        console.error('Error toggling featured status:', error);
        alert('Failed to feature/unfeature post.');
      }
    },
    editPost(post) {
      this.editingPost = post;
      this.newPost = { 
        title: post.title, 
        content: post.content,
        tags: post.tags?.join(', ') || '',
        image: post.image
      };
      this.imagePreview = post.image || null;
      this.showPostModal = true;
    },
    closePostModal() {
      this.showPostModal = false;
      this.editingPost = null;
      this.newPost = { title: '', content: '', tags: '', image: null };
      this.imagePreview = null;
      this.imageFile = null;
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      this.imageFile = file;
      this.imagePreview = URL.createObjectURL(file);
    },
    removeImage() {
      this.imagePreview = null;
      this.imageFile = null;
    },
    async loadSKMembers() {
      const q = query(collection(db, 'sk_members'));
      onSnapshot(q, snapshot => {
        this.skMembers = snapshot.docs.map(doc => ({
          id: doc.id,
          userId: doc.id,
          ...doc.data()
        }));
        this.currentSKMember = this.currentUser 
          ? this.skMembers.find(m => m.userId === this.currentUser.uid) || null
          : null;
      }, error => {
        console.error('Error loading SK members:', error);
      });
    },
    async checkAdminStatus() {
      if (!this.currentUser) return false;
      const userDoc = await getDoc(doc(db, 'users', this.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.role === 'admin' && userData.isApproved === true;
      }
      return false;
    },
    async refreshPosts() {
      try {
        this.isRefreshing = true;
        this.posts = [];
        this.hasMorePosts = true;
        this.lastVisiblePost = null;
        await this.loadPosts();
      } finally {
        this.isRefreshing = false;
      }
    },
    async loadPosts() {
      this.loadingPosts = true;
      try {
        let postsQuery = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          limit(this.postsPerPage)
        );
        
        if (this.lastVisiblePost) {
          postsQuery = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc'),
            startAfter(this.lastVisiblePost),
            limit(this.postsPerPage)
          );
        }
        
        const snapshot = await getDocs(postsQuery);
        this.lastVisiblePost = snapshot.docs[snapshot.docs.length - 1];
        this.hasMorePosts = snapshot.docs.length === this.postsPerPage;
        
        const newPosts = await Promise.all(snapshot.docs.map(async doc => {
          const postData = doc.data();
          const member = this.skMembers.find(m => m.userId === postData.authorId);
          return {
            id: doc.id,
            ...postData,
            authorName: member?.name || postData.authorName || 'Anonymous',
            showComments: false,
            expanded: false,
            comments: []
          };
        }));
        
        this.posts = [...this.posts, ...newPosts];
      } catch (error) {
        console.error('Error loading posts:', error);
        alert('Failed to load posts.');
      } finally {
        this.loadingPosts = false;
      }
    },
    async loadMorePosts() {
      if (!this.hasMorePosts) return;
      
      this.loadingMore = true;
      try {
        await this.loadPosts();
      } finally {
        this.loadingMore = false;
      }
    },
    openImageModal(imageUrl) {
      this.selectedImage = imageUrl;
      this.showImageModal = true;
    }
  },
  async mounted() {
    onAuthStateChanged(auth, async user => {
      this.currentUser = user;
      if (user) {
        await this.loadSKMembers();
        this.isAdmin = await this.checkAdminStatus();
      } else {
        this.isAdmin = false;
        this.skMembers = [];
        this.currentSKMember = null;
      }
    });
    
    await this.loadPosts();
  }
};
</script>

<style scoped>
/* Modern UI Styles */
.sk-forum {
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  color: #333;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.forum-header {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: left;
}

.header-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.header-content p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.new-post-btn {
  background-color: #fff;
  color: #3498db;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.new-post-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.forum-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.forum-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.forum-sidebar {
  padding: 1rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.sidebar-section {
  margin-bottom: 1.5rem;
}

.sidebar-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.filter-tabs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-tabs button {
  background: none;
  border: 1px solid #dee2e6;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
}

.filter-tabs button.active {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
}

.filter-tabs button:hover:not(.active) {
  background-color: #f1f1f1;
}

.refresh-btn {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
}

.refresh-btn:hover {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.forum-main {
  padding: 1rem;
}

.search-box {
  position: relative;
  max-width: 900px;
  margin-bottom: 1.5rem;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
  outline: none;
}

.posts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.post-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.featured-post {
  border-left: 4px solid #3498db;
  background-color: #f8fbfe;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
}

.post-date {
  font-size: 0.75rem;
  color: #6c757d;
  display: block;
}

.featured-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #f8f9fa;
  color: #ffc107;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  margin-top: 0.25rem;
}

.post-actions {
  position: relative;
}

.dropdown-toggle {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.dropdown-toggle:hover {
  background-color: #f1f1f1;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 10;
  display: none;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu a {
  display: block;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.dropdown-menu a:hover {
  background-color: #f8f9fa;
}

.dropdown-menu i {
  width: 20px;
  text-align: center;
  margin-right: 0.5rem;
}

.post-content {
  padding: 1rem;
}

.post-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-title i {
  font-size: 0.85rem;
  color: #6c757d;
}

.post-body {
  margin-top: 0.75rem;
  line-height: 1.5;
  font-size: 0.9rem;
}

.post-image {
  margin-top: 0.75rem;
  border-radius: 8px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.post-image img:hover {
  transform: scale(1.02);
}

.post-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-stats {
  display: flex;
  gap: 1rem;
}

.post-stats span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.post-stats span:hover {
  color: #3498db;
}

.post-stats .liked {
  color: #e74c3c;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background-color: #f1f8ff;
  color: #3498db;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
}

.comments-section {
  border-top: 1px solid #f0f0f0;
  padding: 0.75rem 1rem;
  background-color: #f9f9f9;
}

.comment-list {
  margin-bottom: 0.75rem;
}

.comment {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-content {
  flex-grow: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.comment-author {
  font-weight: 600;
  font-size: 0.85rem;
}

.comment-date {
  font-size: 0.7rem;
  color: #6c757d;
}

.delete-comment {
  margin-left: auto;
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
}

.comment:hover .delete-comment {
  opacity: 1;
}

.add-comment {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.comment-input {
  flex-grow: 1;
  display: flex;
  gap: 0.5rem;
}

.comment-input input {
  flex-grow: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.85rem;
}

.comment-input button {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.comment-input button:hover {
  background-color: #2980b9;
}

.empty-state {
  text-align: center;
  padding: 2rem 0;
}

.empty-icon {
  font-size: 2.5rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1.2rem;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.posts-loading {
  display: grid;
  gap: 1rem;
}

.post-skeleton {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
}

.skeleton-author {
  height: 16px;
  width: 100px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.skeleton-title {
  height: 20px;
  width: 80%;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.skeleton-content {
  height: 14px;
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.skeleton-content.shorter {
  width: 90%;
}

.skeleton-footer {
  height: 16px;
  width: 60%;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-top: 0.75rem;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.load-more button {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.load-more button:hover {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.load-more button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transform: translateY(100px);
  transition: all 0.3s ease-out;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transform: translateY(0);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(100px);
  opacity: 0;
}

.modal-overlay.modal-enter-active,
.modal-overlay.modal-leave-active {
  transition: all 0.3s ease-out;
}

.modal-overlay.modal-enter-from,
.modal-overlay.modal-leave-to {
  opacity: 0;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #e74c3c;
  transform: rotate(90deg);
}

.modal-body {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
  outline: none;
  background-color: white;
}

.image-upload {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background-color: #f8f9fa;
}

.image-upload:hover {
  border-color: #3498db;
  background-color: #e9ecef;
}

.image-upload input[type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder {
  color: #6c757d;
}

.upload-placeholder i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  display: block;
}

.upload-preview {
  position: relative;
}

.upload-preview img {
  max-width: 100%;
  max-height: 150px;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
}

.upload-preview button {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-preview button:hover {
  background-color: #c0392b;
}

.modal-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #333;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}

.submit-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.fab {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 50px;
  height: 50px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  z-index: 100;
}

.fab:hover {
  transform: scale(1.1);
  background-color: #2980b9;
}

.toast {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  background-color: #2ecc71;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.toast i {
  font-size: 1.1rem;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(100px);
  opacity: 0;
}

.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.image-modal-content img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.image-modal-content .close-btn {
  position: absolute;
  top: -30px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .forum-grid {
    grid-template-columns: 1fr;
  }

  .forum-sidebar {
    border-radius: 8px;
    padding: 0.75rem;
  }

  .forum-header {
    padding: 1.5rem 0;
  }

  .header-content h1 {
    font-size: 1.8rem;
  }

  .search-box {
    max-width: 100%;
  }

  .filter-tabs {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .filter-tabs button {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  .post-header {
    padding: 0.75rem;
  }

  .post-content, .post-footer {
    padding: 0.75rem;
  }

  .comments-section {
    padding: 0.5rem 0.75rem;
  }

  .modal-content {
    width: 90%;
  }

  .image-modal-content {
    max-width: 95%;
  }

  .fab {
    width: 40px;
    height: 40px;
    font-size: 1rem;
    bottom: 1rem;
    right: 1rem;
  }

  .toast {
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
}
</style>