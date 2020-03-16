class Modal {
    constructor() {
        const $button = $(document.createElement("button"))
            .attr("type", "button")
            .attr("id", "modal-close-btn")
            .addClass("modal-close-btn")
            .html("<strong>X</strong");
        this.$modalImg = $(document.createElement("img"))
            .addClass("modal-img")
            .attr("alt", "profile picture");
        this.$modalName = $(document.createElement("h3")).addClass(
            "modal-name cap"
        );
        this.$modalEmail = $(document.createElement("p")).addClass("modal-text");
        this.$modalCity = $(document.createElement("p")).addClass("modal-text cap");
        const hr = document.createElement("hr");

        this.$modalPhone = $(document.createElement("p")).addClass("modal-text");
        this.$modalAddress = $(document.createElement("p")).addClass("modal-text");
        this.$modalBirthday = $(document.createElement("p")).addClass("modal-text");

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
        const $modal = $(document.createElement("div"))
            .addClass("modal")
            .append($button, this.$modalInfoContainer);
        this.$prevButton = $(document.createElement("button"))
            .attr("type", "button")
            .attr("id", "modal-prev")
            .addClass("modal-prev,btn")
            .text("Prev");
        this.$nextButton = $(document.createElement("button"))
            .attr("type", "button")
            .attr("id", "modal-next")
            .addClass("modal-next,btn")
            .text("Next");
        const $modalBtnContainer = $(document.createElement("div"))
            .addClass("modal-btn-container")
            .append(this.$prevButton, this.$nextButton);
        this.$modalContainer = $(document.createElement("div"))
            .addClass("modal-container")
            .append($modal, $modalBtnContainer)
            .hide();
        $("body").append(this.$modalContainer);
        $button.click(() => { this.$modalContainer.fadeOut(1000) })
    }

    updateModal = () => {
        this.$modalName.text(currentUser.name);
        this.$modalAddress.text(currentUser.address)
        this.$modalImg.attr('src', currentUser.image)
        this.$modalCity.text(currentUser.city)
        this.$modalEmail.text(currentUser.email)
        this.$modalBirthday.text(`Birthday: ${currentUser.birthday}`)
        this.$modalPhone.text(currentUser.phone)

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

        this.$modalContainer.show();
    }
}

class User {
    constructor(user) {
        this.show = true;

        const formatDOB = dob =>
            `${dob.replace(/(\d{4})-(\d{2})-(\d{2})(.)*/, "$2/$3/$1")}`;
        const formatAddress = location =>
            `${location.street.number} ${location.street.name}., ${location.city}, ${location.state} ${location.postcode}`;
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
        this.card = this.createCard();
    }
    get name() {
        return this.userData.name;
    }
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
    $('.search-container').append($searchForm)
    $gallery.append(errorMessage);
}
function handleSearch(searchTerm) {
    searchTerm && (searchTerm = searchTerm.replace(/(^\s+)/, ''));
    let count = 0
    errorMessage.hide();
    users.forEach(user => {
        if (user.name.toLowerCase().includes(searchTerm) || searchTerm.length === 0) {
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
const displayUsers = () => users.forEach(user => user.addToDisplay());

const startApp = () => {
    fetch("https://randomuser.me/api/?results=20&nat=us")
        .then(data => data.json())
        .then(data => data.results)
        .then(usersData => usersData.map(user => users.push(new User(user))))
        .then(displayUsers)
        .then(addSearchForm);
};

let currentUser;
let currentIndex;
let maxIndex;
const users = [];
const $gallery = $("#gallery");
const modal = new Modal();
const errorMessage = $(document.createElement('h2')).text('No results').attr('id', 'error').hide();

startApp();