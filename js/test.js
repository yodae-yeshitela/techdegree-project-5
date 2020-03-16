const $gallery = $('#gallery');

const users = [];

//function to create a card to display each user on
//takes a user object and returns jquery html element
const createCard = (user,index) =>{
    let $img = 
        $(document.createElement('img'))
        .addClass('card-img')
        .attr('src',user.picture.large);

    let $cardImgContainer = 
        $(document.createElement('div'))
        .addClass('card-info-container')
        .append($img);

    let $cardName = 
        $(document.createElement('h3'))
        .addClass('card-name cap')
        .text( `${user.name.first} ${user.name.last}`);

    let $cardEmail = 
        $(document.createElement('p'))
        .addClass('card-text')
        .text(user.email);

    let $cardCityState = 
        $(document.createElement('p'))
        .addClass('card-text cap')
        .text(`${user.location.city}, ${user.location.state}`);

    let $cardInfoContainer = 
        $(document.createElement('div'))
        .addClass('card-info-container')
        .append($cardName, $cardEmail, $cardCityState);
    
    let $card = 
        $(document.createElement('div'))
        .addClass('card')
        .append($cardImgContainer, $cardInfoContainer)
        .click( () => setModal(user,index,users));

    return $card;
}
//function to get the users from the api and store them in the variable
//users as an array
const showUsers = () =>{
    fetch('https://randomuser.me/api/?results=12&nat=us')
        .then(data => data.json())
        .then( data => data.results)
        .then( userResults => {
            users.push(...userResults);
            return userResults
        })
        .then( users => users.map((user, index) =>createCard(user,index)))
        .then( ($users) => $gallery.append($users))
}


const setModal = (user, index, usersList) => {
    
    const $button = 
        $(document.createElement('button'))
        .attr('type','button')
        .attr('id', 'modal-close-btn')
        .addClass('modal-close-btn')
        .html('<strong>X</strong')
        .click( toggleModal);

    const $modalImg = 
        $(document.createElement('img'))
        .addClass('modal-img')
        .attr('src',user.picture.large)
        .attr('alt', 'profile picture');

    const $modalName = 
        $(document.createElement('h3'))
        .addClass('modal-name cap')
        .text(`${user.name.first} ${user.name.last}`);
    const $modalEmail = 
        $(document.createElement('p'))
        .addClass('modal-text')
        .text(user.email);
    const $modalCity =
        $(document.createElement('p'))
        .addClass('modal-text cap')
        .text(user.location.city);
    const hr = 
        document.createElement('hr');
    const $modalPhone = 
        $(document.createElement('p'))
        .addClass('modal-text')
        .text(user.phone);
    const $modalAddress =
        $(document.createElement('p'))
        .addClass('modal-text')
        .text(`${user.location.street.number} ${user.location.street.name}., ${user.location.city}, ${user.location.state} ${user.location.postcode}`);
    const $modalBirthday =
        $(document.createElement('p'))
        .addClass('modal-text')
        .text(`Birthday: ${user.dob.date.replace( /(\d{4})-(\d{2})-(\d{2})(.)*/, '$2/$3/$1')}`);
    
    const $modalInfoContainer = 
        $(document.createElement('p'))
        .addClass('modal-info-container')
        .append( $modalImg, $modalName, $modalEmail, $modalCity, hr, $modalPhone, $modalAddress, $modalBirthday);
    
    const $modal = 
        $(document.createElement('div'))
        .addClass('modal')
        .append($button, $modalInfoContainer);
    
    const $prevButton = 
        $(document.createElement('button'))
        .attr('type','button')
        .attr('id', 'modal-prev')
        .addClass('modal-prev,btn')
        .text('Prev')
        .click( () =>{
            toggleModal();
            setModal(usersList[index - 1], index - 1, usersList)
        });
    const $nextButton =  
        $(document.createElement('button'))
        .attr('type','button')
        .attr('id', 'modal-next')
        .addClass('modal-next,btn')
        .text('Next')
        .click( () =>{
            toggleModal();
            setModal(usersList[index + 1], index + 1, usersList)
        });;
   
    const $modalBtnContainer = 
        $(document.createElement('div'))
        .addClass('modal-btn-container')
        .append( index != 0? $prevButton: null)
        .append( index != 11? $nextButton: null);

    const $modalContainer = 
        $(document.createElement('div'))
        .addClass('modal-container')
        .append($modal,$modalBtnContainer);

    $('body').append($modalContainer);
}

const toggleModal = () =>{
    $('.modal-container').fadeOut(3000).remove();
}
const showSearch = () =>{

    const $searchField = 
        $(document.createElement('input'))
        .attr('type','search')
        .attr('id','search-input')
        .addClass('search-input')
        .attr('placeholder','Search...')
        .keyup( event => handleSearch( $(event.target).val()));
    const $searchButton = 
        $(document.createElement('input'))
        .attr('type','submit')
        .attr('value','Search')
        .attr('id','search-submit')
        .addClass('search-submit')

    const $searchForm = 
        $(document.createElement('form'))
        .attr('action', '#')
        .attr('method', 'get')
        .append($searchField, $searchButton)
        .submit( event => handleSearch( $(event.target).children('#search-input').val()));
        
    $('.search-container').prepend($searchForm)
}

function handleSearch(searchTerm){
    $('.card').hide();
    if(searchTerm === ''){
        $('.card').show();
    }else{
        $('.card').each( function(){
                console.log($(this).children('>.cl'));
        }
        )
    }
}


showSearch();
showUsers();


