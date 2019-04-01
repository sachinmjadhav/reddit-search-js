const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Form Event Listener
searchForm.addEventListener('submit', e => {
  // Get Search Term
  const searchTerm = searchInput.value;
  // Get Sort
  const sortBy = document.querySelector('input[name="SortBy"]:checked').value;
  // Get Limit
  const searchLimit = document.getElementById('limit').value;

  // Check Input
  if (searchTerm === '') {
    // Show message
    showMessage('Please add a search term', 'alert-danger');
  }

  // Clear input
  searchInput.value = '';

  // Search Reddit
  searchReddit(searchTerm, searchLimit, sortBy)
    .then(results => {
      let output = '<div class="card-columns">';
        results.forEach(post => {
          // Check for image
          let image = post.preview ? post.preview.images[0].source.url :'https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg';

          output += `
            <div class="card">
              <img class="card-img-top" src="${image}" alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${truncateText(post.selftext, 100)}</p>
                <a href="${post.url}" target="_blank" class="btn btn-primary">Read More</a>
                <hr>
                <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span>
                <span class="badge badge-dark">Score: ${post.score}</span>
              </div>
            </div>
          `;
        });

        output += '</div>';

      document.getElementById('results').innerHTML = output;
  });

  e.preventDefault();
});


// Show message
function showMessage(message, className) {
  // Create div
  const div = document.createElement('div');
  // Add Classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const searchContainer = document.getElementById('search-container');
  // Get Search
  const search = document.getElementById('search');

  // Insert Message
  searchContainer.insertBefore(div, search);

  // Timeout alert
  setTimeout(() => document.querySelector('.alert').remove(), 3000);
}


// Truncate text

function truncateText(text, limit) {
  const shortened = text.indexOf(' ', limit);
  if(shortened == -1) return text;
  return text.substring(0, shortened);
}


// Search
let searchReddit = function (searchTerm, searchLimit, sortBy) {
  return fetch(
    `https://www.reddit.com/search.json?q=${searchTerm}&
    sort=${sortBy}&limit=${searchLimit}`)
    .then(res => res.json())
    .then(data => data.data.children.map(data =>
      data.data))
    .catch(err => console.log(err));
}
