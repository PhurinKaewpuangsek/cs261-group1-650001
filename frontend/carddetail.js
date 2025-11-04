// Mock Database (สำหรับ testing)
const mockDatabase = {
    "650001": {
        reviewId: "650001",
        courseCode: "CS111",
        courseName: "Object-Oriented Concepts",
        courseSection: "650001",
        professor: "John Deelan",
        reviewTitle: "Great Introduction to OOP",
        rating: 4,
        reviewText: "This course was incredibly challenging, covering complex iteration. Prof. Somsak explains clearly, but homework load is heavy. Expect sing. However, I learned a tremendous amount and highly recommend if can handle the workload!",
        reviewedBy: "Anonymous",
        reviewDate: "Nov 2, 2025",
        helpfulCount: 7,
        notHelpfulCount: 2
    },
    "650002": {
        reviewId: "650002",
        courseCode: "CS261",
        courseName: "Data Structures",
        courseSection: "650001",
        professor: "Sarah Johnson",
        reviewTitle: "Challenging but Rewarding",
        rating: 5,
        reviewText: "Amazing course! The professor is very knowledgeable and explains complex topics clearly. Homework is tough but fair. Highly recommend!",
        reviewedBy: "Student123",
        reviewDate: "Nov 1, 2025",
        helpfulCount: 15,
        notHelpfulCount: 1
    },
    "650003": {
        reviewId: "650003",
        courseCode: "CS240",
        courseName: "Web Development",
        courseSection: "650001",
        professor: "Mike Brown",
        reviewTitle: "Fun and Practical",
        rating: 3,
        reviewText: "Good course overall. Lots of hands-on projects. Could use more examples in class. Final project was interesting.",
        reviewedBy: "WebDev2025",
        reviewDate: "Oct 30, 2025",
        helpfulCount: 8,
        notHelpfulCount: 3
    },
    "650004": {
        reviewId: "650004",
        courseCode: "CS233",  // ← ใส่ course code ใหม่
        courseName: "Algorithm Design",
        courseSection: "650001",
        professor: "Dr. Smith",
        reviewTitle: "Very Challenging Course",
        rating: 5,
        reviewText: "Great course but very difficult...",
        reviewedBy: "Student456",
        reviewDate: "Nov 5, 2025",
        helpfulCount: 10,
        notHelpfulCount: 1
    },
};

const mockCommentsDatabase = {
    "650001": [
        { id: 1, author: "Johnny Watson", text: "Great insight, thanks!", timeAgo: "1 hours ago" },
        { id: 2, author: "Ammy Sean", text: "OMGGGG", timeAgo: "13 hours ago" },
        { id: 3, author: "Myria Mars", text: "Good", timeAgo: "22 hours ago" },
        { id: 4, author: "Peter Patt", text: "Wow :)", timeAgo: "1 day ago" }
    ],
    "650002": [
        { id: 1, author: "Alice Chen", text: "I agree! Best course ever!", timeAgo: "2 hours ago" },
        { id: 2, author: "Bob Smith", text: "Very helpful review", timeAgo: "5 hours ago" }
    ],
    "650003": [
        { id: 1, author: "Carol Lee", text: "Thanks for the honest review", timeAgo: "3 hours ago" }
    ]
};

const mockComments = [];
let userVote = null;

// Get URL parameters
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 🔍 Find review by Course Code
function findReviewByCourseCode(courseCode) {
    const searchUpper = courseCode.toUpperCase().trim();
    
    for (const reviewId in mockDatabase) {
        const review = mockDatabase[reviewId];
        if (review.courseCode.toUpperCase() === searchUpper) {
            return { id: reviewId, data: review };
        }
    }
    
    return null;
}

// Fetch review data
async function fetchReviewFromDatabase(searchKey) {
    try {
        console.log('🔍 Fetching review with key:', searchKey);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let reviewData;
        
        // ลองหาด้วย section ID ก่อน
        if (mockDatabase[searchKey]) {
            reviewData = mockDatabase[searchKey];
        } 
        // ถ้าไม่เจอ ลองหาด้วย course code
        else {
            const result = findReviewByCourseCode(searchKey);
            if (result) {
                reviewData = result.data;
            }
        }
        
        if (!reviewData) {
            console.error('❌ Review not found:', searchKey);
            return mockDatabase["650001"];
        }
        
        console.log('✅ Review loaded:', reviewData);
        return reviewData;
        
    } catch (error) {
        console.error('❌ Error fetching review:', error);
        return mockDatabase["650001"];
    }
}

// Fetch comments
async function fetchCommentsFromDatabase(reviewId) {
    try {
        console.log('🔍 Fetching comments for review:', reviewId);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const comments = mockCommentsDatabase[reviewId] || [];
        console.log('✅ Comments loaded:', comments.length, 'comments');
        return comments;
        
    } catch (error) {
        console.error('❌ Error fetching comments:', error);
        return [];
    }
}

// Generate stars
function generateStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<span class="star">★</span>';
        } else {
            starsHTML += '<span class="star empty">★</span>';
        }
    }
    return starsHTML;
}

// Load review
async function loadReview() {
    const reviewId = getURLParameter('reviewId') || '650001';
    const reviewData = await fetchReviewFromDatabase(reviewId);
    
    document.getElementById('pageTitle').textContent = 
        'Review Detail for ' + reviewData.courseCode + ' ' + reviewData.courseName + ' ' + reviewData.courseSection;
    
    const reviewCard = document.getElementById('reviewCard');
    
    reviewCard.innerHTML = 
        '<div class="review-title">Review Title: ' + reviewData.reviewTitle + '</div>' +
        '<div class="course-info">' +
            '<div class="course-code">' + reviewData.courseCode + ' ' + reviewData.courseName + ' ' + reviewData.courseSection + '</div>' +
            '<div class="professor">Professor: ' + reviewData.professor + '</div>' +
        '</div>' +
        '<div class="reviewer-info">' +
            '<div class="reviewer-avatar">👤</div>' +
            '<span>Reviewed by: ' + reviewData.reviewedBy + ' on ' + reviewData.reviewDate + '</span>' +
        '</div>' +
        '<div class="stars">' +
            generateStars(reviewData.rating) +
        '</div>' +
        '<div class="rating-score">' + reviewData.rating + '/5</div>' +
        '<div class="review-text">' + reviewData.reviewText + '</div>' +
        '<div class="helpful-buttons">' +
            '<button class="helpful-btn positive" onclick="markHelpful(true)">' +
                '<span>😊</span>' +
                '<span>Helpful (<span id="helpfulCount">' + reviewData.helpfulCount + '</span>)</span>' +
            '</button>' +
            '<button class="helpful-btn negative" onclick="markHelpful(false)">' +
                '<span>😕</span>' +
                '<span>Not Helpful (<span id="notHelpfulCount">' + reviewData.notHelpfulCount + '</span>)</span>' +
            '</button>' +
        '</div>';
}

// Load comments
async function loadComments() {
    const reviewId = getURLParameter('reviewId') || '650001';
    const comments = await fetchCommentsFromDatabase(reviewId);
    
    mockComments.length = 0;
    mockComments.push(...comments);
    
    const commentsList = document.getElementById('commentsList');
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No comments yet. Be the first to comment!</p>';
        return;
    }
    
    commentsList.innerHTML = comments.map(function(comment) {
        return '<div class="comment">' +
            '<div class="comment-avatar">👤</div>' +
            '<div class="comment-content">' +
                '<div class="comment-author">' + comment.author + '</div>' +
                '<div class="comment-text">' + comment.text + '</div>' +
            '</div>' +
            '<div class="comment-time">' + comment.timeAgo + '</div>' +
        '</div>';
    }).join('');
}

// Add comment
function addComment() {
    const commentInput = document.getElementById('commentInput');
    const text = commentInput.value.trim();
    
    if (text) {
        const newComment = {
            id: mockComments.length + 1,
            author: "You",
            text: text,
            timeAgo: "Just now"
        };
        
        mockComments.unshift(newComment);
        loadComments();
        commentInput.value = '';
    }
}

// 🔍 Search function - แก้ไขให้ redirect ได้
function searchReview() {
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput.value.trim().toUpperCase();
    
    if (!searchQuery) {
        alert('ไม่มีรายวิชานี้');
        return;
    }
    
    console.log('🔍 Searching for:', searchQuery);
    
    // หา review
    let found = false;
    let targetReviewId = null;
    
    // ลองหาด้วย section ID ก่อน
    if (mockDatabase[searchQuery]) {
        found = true;
        targetReviewId = searchQuery;
    } 
    // ลองหาด้วย course code
    else {
        const result = findReviewByCourseCode(searchQuery);
        if (result) {
            found = true;
            targetReviewId = result.id;
        }
    }
    
    if (found) {
        console.log('✅ Found! Redirecting to:', targetReviewId);
        
        // สร้าง URL ใหม่
        const newUrl = window.location.pathname + '?reviewId=' + targetReviewId;
        
        console.log('📍 New URL:', newUrl);
        
        // Redirect
        window.location.href = newUrl;
    } else {
        alert('❌ ไม่พบ Course Code "' + searchQuery + '"\n\nCourse Codes ที่มี: CS111, CS221, CS332');
    }
}

// Reset button styles
function resetButtonStyles(helpfulBtn, notHelpfulBtn) {
    helpfulBtn.style.backgroundColor = 'white';
    helpfulBtn.style.color = '';
    helpfulBtn.style.borderColor = '#ddd';
    helpfulBtn.style.opacity = '1';
    helpfulBtn.disabled = false;
    
    notHelpfulBtn.style.backgroundColor = 'white';
    notHelpfulBtn.style.color = '';
    notHelpfulBtn.style.borderColor = '#ddd';
    notHelpfulBtn.style.opacity = '1';
    notHelpfulBtn.disabled = false;
}

// Mark helpful
function markHelpful(isHelpful) {
    const reviewId = getURLParameter('reviewId') || '650001';
    
    let reviewData = mockDatabase[reviewId];
    if (!reviewData) {
        const result = findReviewByCourseCode(reviewId);
        if (result) reviewData = result.data;
    }
    
    if (!reviewData) return;
    
    const voteType = isHelpful ? 'helpful' : 'not-helpful';
    
    const helpfulBtn = document.querySelector('.helpful-btn.positive');
    const notHelpfulBtn = document.querySelector('.helpful-btn.negative');
    
    // Cancel vote
    if (userVote === voteType) {
        if (isHelpful) {
            reviewData.helpfulCount--;
        } else {
            reviewData.notHelpfulCount--;
        }
        
        userVote = null;
        resetButtonStyles(helpfulBtn, notHelpfulBtn);
        
        document.getElementById('helpfulCount').textContent = reviewData.helpfulCount;
        document.getElementById('notHelpfulCount').textContent = reviewData.notHelpfulCount;
        
        return;
    }
    
    // Switch vote
    if (userVote !== null) {
        if (userVote === 'helpful') {
            reviewData.helpfulCount--;
        } else {
            reviewData.notHelpfulCount--;
        }
    }
    
    // Add new vote
    if (isHelpful) {
        reviewData.helpfulCount++;
    } else {
        reviewData.notHelpfulCount++;
    }
    
    userVote = voteType;
    resetButtonStyles(helpfulBtn, notHelpfulBtn);
    
    if (isHelpful) {
        helpfulBtn.style.backgroundColor = '#4CAF50';
        helpfulBtn.style.color = 'white';
        helpfulBtn.style.borderColor = '#4CAF50';
    } else {
        notHelpfulBtn.style.backgroundColor = '#f44336';
        notHelpfulBtn.style.color = 'white';
        notHelpfulBtn.style.borderColor = '#f44336';
    }
    
    document.getElementById('helpfulCount').textContent = reviewData.helpfulCount;
    document.getElementById('notHelpfulCount').textContent = reviewData.notHelpfulCount;
}

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Page initializing...');
    console.log('📋 Test with: CS111, CS221, CS332 or 650001, 650002, 650003');
    console.log('📍 Current URL:', window.location.href);
    
    await loadReview();
    await loadComments();
    
    // Enter key for comment
    const commentInput = document.getElementById('commentInput');
    if (commentInput) {
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addComment();
            }
        });
    }
    
    // Enter key for search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // ป้องกัน form submit
                searchReview();
            }
        });
    }
    
    console.log('✅ Page loaded!');
});