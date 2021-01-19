


// ******************* Dom Elements *****************
const list = document.querySelector("#quote-list");
const form = document.querySelector("#new-quote-form");
const quotesDiv = document.querySelector("div")

const newButton = document.createElement("button")
    newButton.innerText = "Sort by Author"
quotesDiv.prepend(newButton)

// ******************* Network Requests *****************
const url = `http://localhost:3000/quotes?_embed=likes`
const quotesUrl = `http://localhost:3000/quotes`
const likesUrl = `http://localhost:3000/likes`

const quotesByAuthor = () => {
    list.innerHTML = ""
    fetch("http://localhost:3000/quotes?_sort=author")
    .then(res => res.json())
    .then(quotesArray => {
        quotesArray.forEach (createNewQuote)
    })
}

const initializeQuotes = () =>{
    list.innerHTML = ""
    fetch(url)
    .then(res => res.json())
    .then(quotesArray => {
        quotesArray.forEach(createNewQuote)
    })
}

const postNewQuote = quoteObj => {
    fetch(quotesUrl,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quoteObj)
    })
    .then(res => res.json())
    .then(quote => {
        createNewQuote(quote)
    })
}

const deleteQuote = event => {
    const id = event.target.closest("li").dataset.id

    fetch(`${quotesUrl}/${id}`,{
        method: 'DELETE',
    })
    // .then(res => res.json())
    // .then(console.log("Delete Successful"))
    
    event.target.closest("li").remove()
}

const likeQuote = event => {
    const id = parseInt(event.target.closest("li").dataset.id)
    const newLike = {
        "quoteId": id,
        "createdAt": Date.now()
    }
    
    fetch(likesUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLike)
    })
    .then (res => res.json())
    .then (likeObj => updateLike(likeObj))
}   

const updateLike = likeObj => {
    const quoteLi = document.querySelector(`[data-id='${likeObj.quoteId}']`)
    const span = quoteLi.querySelector("span")
    span.innerText = parseInt(span.innerText) + 1
}

const editQuote = event => {
    const li = event.target.closest("li")
    if (event.target.dataset.show === "false") {
        event.target.dataset.show = true
        event.target.innerText = "Cancel Edits"
        li.querySelector('form').style.display = "block"
    } else {
        event.target.dataset.show = false
        event.target.innerText = "Edit"
        li.querySelector('form').style.display = "none"
    }
}

const updateQuote = event => {
    const id = parseInt(event.target.closest("li").dataset.id)
        if (event.target.quote.value === "") {
            event.target.quote.value = event.target.quote.placeholder
        }
        if (event.target.author.value === "") {
            event.target.author.value = event.target.author.placeholder
        }

    const updatedQuote = getFormInfo(event)

    fetch(`${quotesUrl}/${id}`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedQuote)
    })
    .then (res => res.json())
    .then (updatedObj => {
        event.target.closest("li").innerHTML = updateQuoteLi(updatedObj)
    })
}   


// ******************* Events Listeners *****************

form.addEventListener('submit', event => {
    event.preventDefault()
    postNewQuote(getFormInfo(event))
    event.target.reset()
})

const getFormInfo = event => {
    return {
        "quote": event.target.quote.value,
        "author": event.target.author.value
    }
}

list.addEventListener('click', event => {
    if (event.target.matches('.btn-danger')){
        deleteQuote(event)
    } else if (event.target.matches('.btn-success')){
        likeQuote(event)
    } else if (event.target.matches(".edit-btn")){
        editQuote(event)
    }
})

list.addEventListener('submit', event => {
    event.preventDefault()
    updateQuote(event)
    event.target.reset()
})

newButton.addEventListener('click', event => {
    if (event.target.innerText === "Sort by Author") {
        event.target.innerText = "Sort by ID"
        quotesByAuthor()
    } else {
        event.target.innerText = "Sort by Author"
        initializeQuotes()
    }

})

// ******************* Dom Manipulation / functions *****************

const createNewQuote = (quote) => {
    if (!quote.likes) {
        quote.likes = []
    }
    let newQuote = `
        <li class='quote-card' data-id=${quote.id} >
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
                <button class='btn-danger'>Delete</button>
                <button class='edit-btn'>Edit</button>
            </blockquote>
            <form id="edit-quote-form" style="display: none;" data-show="false" >
                <div class="form-group">
                    <label for="new-quote">Quote</label>
                    <input name="quote" type="text" class="form-control" id="new-quote" placeholder="${quote.quote}">
                </div>
                <div class="form-group">
                    <label for="Author">Author</label>
                    <input name="author" type="text" class="form-control" id="author" placeholder="${quote.author}">
                </div>
                <button type="submit" class="btn btn-primary">Update</button>
            </form>
        </li>`

    list.innerHTML += newQuote
}

const updateQuoteLi = quote => {
    if (!quote.likes) {
        quote.likes = []
    }
    return `
    <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
        <button class='edit-btn'>Edit</button>
    </blockquote>
    <form id="edit-quote-form" style="display: none;" data-show="false" >
        <div class="form-group">
            <label for="new-quote">Quote</label>
            <input name="quote" type="text" class="form-control" id="new-quote" placeholder="${quote.quote}">
        </div>
        <div class="form-group">
            <label for="Author">Author</label>
            <input name="author" type="text" class="form-control" id="author" placeholder="${quote.author}">
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
    </form>`
}

// ******************* Run Code *****************

initializeQuotes()