 // Initialize an array of quote objects
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "The purpose of our lives is to be happy.", category: "Happiness" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      alert('New quote added successfully!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }
  
  // Event listener for showing a new random quote
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Event listener for adding a new quote
  document.getElementById('addQuoteButton').addEventListener('click', addQuote);
  
