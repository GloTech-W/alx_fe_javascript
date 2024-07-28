// Initialize an array of quote objects or load from local storage
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "The purpose of our lives is to be happy.", category: "Happiness" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  ];
  
  // Function to save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - ${randomQuote.category}</p>`;
    sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
  }
  
  // Function to create the form for adding new quotes
  function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addQuoteButton">Add Quote</button>
    `;
  
    document.body.appendChild(formContainer);
  
    document.getElementById('addQuoteButton').addEventListener('click', addQuote);
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
      saveQuotes();
      postQuoteToServer(newQuote);
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      populateCategories();
      alert('New quote added successfully!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }
  
  // Function to export quotes to JSON
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
  }
  
  // Function to import quotes from JSON
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Function to populate the category filter dropdown
  function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
  
  // Function to filter quotes based on selected category
  function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';
    filteredQuotes.forEach(quote => {
      const quoteElement = document.createElement('p');
      quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
      quoteDisplay.appendChild(quoteElement);
    });
    localStorage.setItem('lastSelectedCategory', selectedCategory);
  }
  
  // Function to fetch quotes from a simulated server
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const serverQuotes = await response.json();
      
      // Simulate converting server response to quote objects
      const newQuotes = serverQuotes.map(post => ({
        text: post.title,
        category: "Server"
      }));
  
      return newQuotes;
    } catch (error) {
      console.error('Failed to fetch quotes from server:', error);
      return [];
    }
  }
  
  // Function to post a new quote to the server
  async function postQuoteToServer(newQuote) {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
      });
      if (!response.ok) {
        throw new Error('Failed to post new quote to server');
      }
      const serverResponse = await response.json();
      console.log('Posted new quote to server:', serverResponse);
    } catch (error) {
      console.error('Error posting new quote to server:', error);
    }
  }
  
  // Function to sync quotes with the server
  async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
  
    // Resolve conflicts: server quotes take precedence
    serverQuotes.forEach(serverQuote => {
      const existingQuoteIndex = quotes.findIndex(quote => quote.text === serverQuote.text);
      if (existingQuoteIndex !== -1) {
        quotes[existingQuoteIndex] = serverQuote; // Overwrite local quote with server quote
      } else {
        quotes.push(serverQuote); // Add new server quote
      }
    });
  
    saveQuotes();
    populateCategories();
    filterQuotes();
  
    // Notify user of the sync
    const notification = document.createElement('div');
    notification.id = 'syncNotification';
    notification.textContent = 'Quotes synced with server!';
    notification.style.position = 'fixed';
    notification.style.bottom = '10px';
    notification.style.right = '10px';
    notification.style.backgroundColor = 'green';
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    document.body.appendChild(notification);
  
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  }
  
  // Periodically check for new quotes from the server
  setInterval(syncQuotes, 60000); // Check every 60 seconds
  
  // Display the last viewed quote if available in session storage
  window.onload = function() {
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.innerHTML = `<p>"${lastQuote.text}" - ${lastQuote.category}</p>`;
    }
    populateCategories();
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
      document.getElementById('categoryFilter').value = lastSelectedCategory;
      filterQuotes();
    }
    syncQuotes(); // Fetch quotes from the simulated server on page load
  };
  
  // Create the form for adding new quotes on page load
  createAddQuoteForm();
  
  // Add event listener for showing a new random quote
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Add event listener for exporting quotes
  document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
  