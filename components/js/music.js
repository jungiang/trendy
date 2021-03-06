class Music {
    constructor() {
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleError = this.handleError.bind(this);
        this.addMoreResults = this.addMoreResults.bind(this);
        this.musicIndex = 0;
        this.index = 10;

        this.loader();
    }
    loader() {
        const loader = $('<div>').addClass('loader');
        const pageLoader = $('<div>').addClass('page-loader').append(loader);
        $('#main-content').append(pageLoader);
    }
    getDataFromServer() {
        const ajaxObject = {
            dataType: "json",
            url: "components/php/itunes.php",
            method: "GET",
            success: (response) => {
                this.handleSuccess(response);
            },
            error: this.handleError
        }
        $('.page-loader').show();
        $.ajax(ajaxObject);
    }
    handleSuccess(response) {
        $('.page-loader').hide();
        for (let index = 0; index < this.index; index++) {
            const albumImage = response.feed.results[index].artworkUrl100;
            const albumName = `# ${index + 1} :  ${response.feed.results[index].collectionName}`;
            const artist = response.feed.results[index].artistName;
            const songName = response.feed.results[index].name;
            const iTunesAlbum = response.feed.results[index].url;
            const newDiv = this.newElement(albumImage, albumName, artist, songName, iTunesAlbum);
            this.render('#main-content', newDiv)
        }
        this.index += 10
    }

    handleError() {
        $('.page-loader').hide();
        const errorimg = $('<img>').attr({
            'src': 'components/css/images/serverdown.png',
            'width': '100%'
        });
        const errorMessage = $('<div>').addClass('error-message');
        errorMessage.append(errorimg);
        const errorContainer = $('<div>').addClass('error-container').append(errorMessage);
        this.render('#main-content', errorContainer);
    }
    newElement(image, album, artist, song, link) {
        const imageBox = $('<div>').addClass('image-box').css('background-image', `url(${image})`);
        const albumText = $('<p>').text(album);
        const albumLink = $('<a target="_blank">').attr('href', link);
        albumLink.append(albumText);
        const albumTitle = $('<div>').addClass('title-box').append(albumLink);
        const artistDescription = $('<p>').text('Artist: ' + artist);
        const songName = $('<p>').text('Song Name: ' + song);
        const artistAndSongDescription = $('<div>').addClass('description-box').append(artistDescription, songName);
        const textBox = $('<div>').addClass('text-box').append(albumTitle, artistAndSongDescription);
        const contentBox = $('<div>').addClass('content-box').append(imageBox, textBox);
        return contentBox;
    }
    render(divContainer, newElement) {
        $(divContainer).append(newElement);
    }
    addMoreResults() {
        $('#main-content').empty();
        this.loader();
        this.addMoreResultsButton();
        this.getDataFromServer();
        
    }

    addMoreResultsButton() {
        const addButton = $('<button>').addClass('add-button').text('Show More').on('click', this.addMoreResults);
        this.render('#main-content', addButton);
    }
}

