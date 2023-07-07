function fetchData() {
  fetch('http://localhost:3000/posts')
    .then(resp => resp.json())
    .then(posts => {
      const parentContainer = document.querySelector('.parent-container');
      const allPostsContainer = parentContainer.querySelector('.allposts');

      let contentHTML = '';

      posts.forEach(post => {
        const content = `
          <div class="content">
            <div class="top-container">
              <img class="profile-image" src="images/logo.png" alt="Profile Image">
              <p class="username">${post.name}</p>
              <div class="dropdown">
                <button class="deletebtn">delete</button>
              </div>
            </div>
            <br>
            <div class="card">
              <img class="card__icon" src="${post.image}" alt="Card Icon">
              <div class="card__content">
                <p class="card__title">${post.title}</p>
                <p class="card__description">${post.description}</p>
                <br>
                <span>Art by: ${post.name}</span>
              </div>
            </div>
            <div class="actions">
              <button class="button" id="heartsbtn">❤️ <span id="heartscount">73</span></button>
              <button class="button" id="likesbtn">👍 <span id="likescount">63</span></button>
              <button class="button" id="dislikesbtn">👎 <span id="dislikescount">12</span></button>
              
              <div class="popup-icon" onclick="toggleCommentSection()">
                <img src="images/comment.avif" alt="Comment Icon">
              </div>
          
              <div class="comment-section" id="commentSection">
                <h3>Comments</h3>
                <ul id="commentList">
                  <!-- Comment items will be dynamically added here -->
                </ul>
                <form id="commentForm">
                  <textarea id="commentInput" placeholder="Add a comment"></textarea>
                  <button type="submit">Post</button>
                </form>
              </div>
            </div>
            <br>
            <button class="auction-button">Auction</button>
            <p id="worth">Worth:﹩${post.worth}</p>
          </div>
        `;

        contentHTML += content;
      });

      allPostsContainer.innerHTML = contentHTML;
      deletePost();
      actionsByUser();
      auctionBtn();
      createPopupCommentSection();
      searchPosts()
    });
}

fetchData();



function postData() {
  const form = document.querySelector('.submit-btn');

  form.addEventListener('click', (event) => {
    event.preventDefault();

    const nameInput = document.querySelector('#name')
    const titleInput = document.querySelector('#title')
    const descriptionInput = document.querySelector('#description')
    const fileInput = document.querySelector('#file-input')
    const worth = document.querySelector('#worthinput')

    const postObject = {
      name: nameInput.value,
      title: titleInput.value,
      description: descriptionInput.value,
      image: `images/${fileInput.files[0].name}`,
      worth: worth.value
    };

    fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postObject)
    })
  });
}

postData();


function deletePost() {
  const deleteButtons = document.querySelectorAll('.deletebtn');
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', () => {
      const contentElement = deleteButton.closest('.content');
        contentElement.remove();
    });
  });
}

function actionsByUser() {
  const posts = document.querySelectorAll('.content');

  posts.forEach(function(post) {
    const heartBtn = post.querySelector('#heartsbtn');
    const likeBtn = post.querySelector('#likesbtn');
    const dislikeBtn = post.querySelector('#dislikesbtn');

    const heartsCount = post.querySelector('#heartscount');
    const likesCount = post.querySelector('#likescount');
    const dislikesCount = post.querySelector('#dislikescount');

    heartBtn.addEventListener('click', function() {
      if (!heartBtn.classList.contains('clicked')) {
        let hearts = parseInt(heartsCount.textContent);
        hearts += 1;
        heartsCount.textContent = hearts;
        heartBtn.classList.add('clicked');
        likeBtn.disabled = true;
        dislikeBtn.disabled = true;
        console.log(heartsCount);
      }
    });

    likeBtn.addEventListener('click', function() {
      if (!likeBtn.classList.contains('clicked')) {
        let likes = parseInt(likesCount.textContent);
        likes += 1;
        likesCount.textContent = likes;
        likeBtn.classList.add('clicked');
        heartBtn.disabled = true;
        dislikeBtn.disabled = true;
        console.log(likesCount);
      }
    });

    dislikeBtn.addEventListener('click', function() {
      if (!dislikeBtn.classList.contains('clicked')) {
        let dislikes = parseInt(dislikesCount.textContent);
        dislikes += 1;
        dislikesCount.textContent = dislikes;
        dislikeBtn.classList.add('clicked');
        heartBtn.disabled = true;
        likeBtn.disabled = true;
        console.log(dislikesCount);
      }
    });
  });
}



function auctionBtn() {
  const posts = document.querySelectorAll('.content');

  posts.forEach(post => {
    const auctionBtn = post.querySelector('.auction-button');
    auctionBtn.addEventListener('click', () => {
      const originalWorth = post.querySelector('#worth').textContent.slice(7);
      const newWorth = prompt(`♕𝑒𝑛𝑡𝑒𝑟 𝑠𝑖𝑙𝑒𝑛𝑡 𝑎𝑢𝑐𝑡𝑖𝑜𝑛 Worth: ${originalWorth}`);

      if (newWorth && parseInt(newWorth) > parseInt(originalWorth)) {
        const worthElement = post.querySelector('#worth');
        worthElement.textContent = `Worth:﹩${newWorth}`;

        const updateData = { worth: parseInt(newWorth) };

        fetch(`http://localhost:3000/posts/${post.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(updateData)
        })
          .then(resp => resp.json())
          .then(updatedPost => {
            console.log('Post updated:', updatedPost);
          })
          .catch(error => {
            console.log('Error updating post:', error);
          });
      }
    });
  });
}

auctionBtn();

function createPopupCommentSection() {
  function toggleCommentSection() {
    const commentSection = document.getElementById('commentSection');
    commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
  }

  document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const commentInput = document.getElementById('commentInput');
    const commentList = document.getElementById('commentList');
    const newComment = document.createElement('li');
    newComment.textContent = commentInput.value;
    commentList.appendChild(newComment);
    commentInput.value = '';
  });
  const popupIcons = document.querySelectorAll('.popup-icon');
  popupIcons.forEach(icon => {
    icon.addEventListener('click', toggleCommentSection);
  });
}

createPopupCommentSection();

function searchPosts() {
  const searchInput = document.querySelector('.input');
  const allPosts = document.querySelectorAll('.content');

  searchInput.addEventListener('input', () => {
    const userSearch = searchInput.value.toLowerCase();

    allPosts.forEach(post => {
      const username = post.querySelector('.username').textContent.toLowerCase();
      const title = post.querySelector('.card__title').textContent.toLowerCase();
      const description = post.querySelector('.card__description').textContent.toLowerCase();

      if (
        username.includes(userSearch) ||
        title.includes(userSearch) ||
        description.includes(userSearch)
      ) {
        post.style.display = 'block';
      } else {
        post.style.display = 'none';
      }
    });
  });
}

searchPosts();


