// js for read more content--------------------------------------------

/* when the "Read more" button is clicked, the "more content" will show up and 
when the "Read less" button is clicked, it will be hidden */
function readMore(dotsId,readBtnId, moreContentId ){
    const dots = document.getElementById(dotsId);
    const readBtn = document.getElementById(readBtnId);
    const moreContent = document.getElementById(moreContentId);
   
    readBtn.addEventListener('click', (e)=>{
        moreContent.classList.toggle('show-more');
        dots.classList.toggle('hide-dots');
        if(readBtn.innerText === "Read more"){
            readBtn.innerText = "Read less";
        }else{
            readBtn.innerText = "Read more";
        }
    })  
  }
  
  readMore('dots-1', 'read-btn-1', 'more-content-1');
  readMore('dots-2', 'read-btn-2', 'more-content-2');
  readMore('dots-3', 'read-btn-3', 'more-content-3');
  readMore('dots-4', 'read-btn-4', 'more-content-4');
  
  
  
  // js for submissom conformed alert-------------------------------------
  const form = document.getElementById("subcription-form");
  //when the form is submitted, an alert box will pop up
  form.addEventListener("submit", (e) => {
    alert("Thank you for subscribing to My English Club newsletter!");
  });
  
  
  //use of templting engine, handlebars, for monthly book recommendations----------
  //the template is in the readingWriting.html
  //data 
  var bookList = {
    'books': [
      {
        'bookName': 'Outliers',
        'author': 'Malcolm Gladwell',
        'type': 'Nonfiction'
      },
      {
        'bookName': 'Leaving Time',
        'author': 'Jodi Picoult',
        'type': 'Literature & Fiction'
      },
      {
        'bookName': '1st to Die',
        'author': 'James Patterson',
        'type': 'Women\'s Murder Club'
      }
    ]
  };
  
  var bookSrc = document.getElementById("book-recommendations-template").innerHTML;
  var bookTemplate = Handlebars.compile(bookSrc);
  var bookRender = bookTemplate(bookList);
  document.getElementById("book-recommendations").innerHTML = bookRender;
  
  
  
  // js for go to top button----------------------------------------------------
  var topBtn = document.getElementById('top-btn');
  
  window.addEventListener('scroll', ()=> {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      topBtn.style.display = "block";
    } else {
      topBtn.style.display = "none";
    }
  })
  
  // When the user clicks on the button, scroll to the top of the page
  topBtn.addEventListener('click', ()=> {
    // For Safari
    document.body.scrollTop = 0; 
    // For Chrome, Firefox, IE and Opera
    document.documentElement.scrollTop = 0;
  });
  
     