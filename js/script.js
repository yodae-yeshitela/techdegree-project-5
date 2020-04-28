// A class that represents a modal to display a user with its own
//methods and html components
class Modal {
    constructor() {
        //button to close the modal dialog
        const $button = $(document.createElement("button"))
            .attr("type", "button")
            .attr("id", "modal-close-btn")
            .addClass("modal-close-btn")
            .html("<strong>X</strong");
        //html image component for displaying user profile picture
        this.$modalImg = $(document.createElement("img"))
            .addClass("modal-img")
            .attr("alt", "profile picture");
        //name of user component
        this.$modalName = $(document.createElement("h3")).addClass(
            "modal-name cap"
        );
        // user email component
        this.$modalEmail = $(document.createElement("p")).addClass("modal-text");
        //user city component
        this.$modalCity = $(document.createElement("p")).addClass("modal-text cap");
        //horizontal rule html component
        const hr = document.createElement("hr");
        //phone number component
        this.$modalPhone = $(document.createElement("p")).addClass("modal-text");
        //address placeholder
        this.$modalAddress = $(document.createElement("p")).addClass("modal-text");
        //birthday place holder
        this.$modalBirthday = $(document.createElement("p")).addClass("modal-text");
        //a container for the info placeholder
        this.$modalInfoContainer = $(document.createElement("div"))
            .addClass("modal-info-container")
            .append(
                this.$modalImg,
                this.$modalName,
                this.$modalEmail,
                this.$modalCity,
                hr,
                this.$modalPhone,
                this.$modalAddress,
                this.$modalBirthday
            );
        //the modal component that contains all modal components
        const $modal = $(document.createElement("div"))
            .addClass("modal")
            .append($button, this.$modalInfoContainer);
        //previous button for navigation
        this.$prevButton = $(document.createElement("button"))
            .attr("type", "button")
            .attr("id", "modal-prev")
            .addClass("modal-prev,btn")
            .text("Prev");
        //next button for navigation
        this.$nextButton = $(document.createElement("button"))
            .attr("type", "button")
            .attr("id", "modal-next")
            .addClass("modal-next,btn")
            .text("Next");
        //container for the next and prev buttons
        const $modalBtnContainer = $(document.createElement("div"))
            .addClass("modal-btn-container")
            .append(this.$prevButton, this.$nextButton);
        //larger div component which holds modal and the navigation buttons
        this.$modalContainer = $(document.createElement("div"))
            .addClass("modal-container")
            .append($modal, $modalBtnContainer)
            .hide();
        //add the modal to the screen
        //initally the modal is invisble and does not contain any information
        $("body").append(this.$modalContainer);
        //hide the modal when the close button is closed
        $button.click(() => { this.$modalContainer.fadeOut(1000) })
    }
    //function to update the modal to display the selected user
    updateModal = () => {
        this.$modalName.text(currentUser.name);
        this.$modalAddress.text(currentUser.address)
        this.$modalImg.attr('src', currentUser.image)
        this.$modalCity.text(currentUser.city)
        this.$modalEmail.text(currentUser.email)
        this.$modalBirthday.text(`Birthday: ${currentUser.birthday}`)
        this.$modalPhone.text(currentUser.phone)

        //use conditional statement to hide/display navigation buttons based
        //on the index of the modal being displayed
        if (currentIndex < maxIndex) {
            this.$nextButton
                .show()
                .off()
                .click(() => {
                    currentUser = users.filter(user => user.show)[currentIndex + 1].userData;
                    currentIndex = currentIndex + 1;
                    modal.updateModal()
                });
        } else this.$nextButton.hide();

        if (currentIndex > 0) {
            const prevUser = users.filter(user => user.show)[currentIndex - 1].userData;
            this.$prevButton
                .show()
                .off()
                .click(() => {
                    currentUser = users.filter(user => user.show)[currentIndex - 1].userData;
                    currentIndex = currentIndex - 1;
                    modal.updateModal()
                });
        } else this.$prevButton.hide(200);
        //display the modal after adding the corresponding user information 
        this.$modalContainer.show();
    }
}


//user class to represent a user and hold the information about a user
//and also create a card to represent the user on the list
class User {
    constructor(user) {
        this.show = true;
        //format date of birth
        const formatDOB = dob =>
            `${dob.replace(/(\d{4})-(\d{2})-(\d{2})(.)*/, "$2/$3/$1")}`;
        //format address of user
        const formatAddress = location =>
            `${location.street.number} ${location.street.name}., ${location.city}, ${location.state} ${location.postcode}`;
        
        //store the user information using variables
        this.userData = {
                name: `${user.name.first} ${user.name.last}`,
                email: user.email,
                image: user.picture.large,
                city: user.location.city,
                state: user.location.state,
                phone: user.phone,
                address: formatAddress(user.location),
                birthday: formatDOB(user.dob.date)
        };
        //create a card for the user and save it
        this.card = this.createCard();
    }
    //get the name of a user for search purposes
    get name() {
        return this.userData.name;
    }
    //create a card that represents a user and is clickable to display the modal
    createCard  = () => {
        let $img = $(document.createElement("img"))
            .addClass("card-img")
            .attr("src", this.userData.image);

        let $cardImgContainer = $(document.createElement("div"))
            .addClass("card-info-container")
            .append($img);

        let $cardName = $(document.createElement("h3"))
            .addClass("card-name cap")
            .text(this.userData.name);

        let $cardEmail = $(document.createElement("p"))
            .addClass("card-text")
            .text(this.userData.email);

        let $cardCityState = $(document.createElement("p"))
            .addClass("card-text cap")
            .text(`${this.userData.city}, ${this.userData.state}`);

        let $cardInfoContainer = $(document.createElement("div"))
            .addClass("card-info-container")
            .append($cardName, $cardEmail, $cardCityState);

        let $card = $(document.createElement("div"))
            .addClass("card")
            .append($cardImgContainer, $cardInfoContainer);

        return $card;
    };
    //add the card to the screen
    addToDisplay = function () {
        $gallery.append(this.card);
        this.card.click(() => {
            currentUser = this.userData;
            currentIndex = users.filter(user => user.show).indexOf(this);
            maxIndex = maxIndex = users.filter(user => user.show).length - 1;
            modal.updateModal()
        });
    }
}
//function to add the search functionality
const addSearchForm = () => {
    const $searchField =
        $(document.createElement('input'))
            .attr('type', 'search')
            .attr('id', 'search-input')
            .addClass('search-input')
            .attr('placeholder', 'Search...')
            .on('input keyup', event => handleSearch($(event.target).val()));
    const $searchButton =
        $(document.createElement('input'))
            .attr('type', 'submit')
            .attr('value', 'Search')
            .attr('id', 'search-submit')
            .addClass('search-submit')
    const $searchForm =
        $(document.createElement('form'))
            .attr('action', '#')
            .attr('method', 'get')
            .append($searchField, $searchButton)
            .submit(event => handleSearch($(event.target).children('#search-input').val()));
    
    //add the search form to screen
    $('.search-container').append($searchForm)
    //add error message placeholder which is invisble to screen 
    $gallery.append(errorMessage);
}

//a function to handle search
function handleSearch(searchTerm) {
    //remove leading whitespace characters from search string
    searchTerm && (searchTerm = searchTerm.replace(/(^\s+)/, ''));
    let count = 0
    errorMessage.hide();
    
    //perform comparision for search term among the users
    users.forEach(user => {
        if (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm.length === 0) {
            user.show = true;
            user.card.show();
            count++;
        } else {
            user.show = false;
            user.card.hide();
        }
    })
    if (count == 0) {
        errorMessage.show()
    }

}

//function to display each user
const displayUsers = () => users.forEach(user => user.addToDisplay());

//a function which makes the data request then adds the initial view of the application
const startApp = () => {
    fetch("https://randomuser.me/api/?results=12")
        .then(data => data.json())
        .then(data => data.results)
        .then(usersData => usersData.map(user => users.push(new User(user))))
        .then(displayUsers)
        .then(addSearchForm);
};

let currentUser;    //hold current user being displayed
let currentIndex;   //holds index of current user
let maxIndex;   //the total number of users to display
const users = []; //hold the users
const $gallery = $("#gallery"); //the container for the cards
const modal = new Modal(); //a modal dialog which is a place holder
const errorMessage = $(document.createElement('h2')).text('No results').attr('id', 'error').hide();//error message for no search results


// a call to the start application function
startApp();