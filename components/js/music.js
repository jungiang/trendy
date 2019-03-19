$(document).ready(startMusic);

var iTunesMusic = null;

function startMusic() {
    iTunesMusic = new Music();
}

class Music {
    constructor() {
        this.getDataFromServer();
    }
    getDataFromServer() {
        const ajaxObject = {
            dataType: "json",
            url: "components/php/itunes.php",
            method: "GET",
            success: (response) => {
                console.log(response);
                // debugger;
                for (var index = 0; index <= response.feed.results.length; index++) {
                var albumImage = response.feed.results[index].artworkUrl100;
                var albumName = response.feed.results[index].collectionName;
                var artist = response.feed.results[index].artistName;
                var songName = response.feed.results[index].name;
                var iTunesAlbum = response.feed.results[index].url;
                var newDiv = iTunesMusic.newElement(albumImage, albumName, artist, songName, iTunesAlbum);
                iTunesMusic.render('#main-content', newDiv)
                }
            },
            // error: 
        }
        $.ajax(ajaxObject);
    }
    newElement(image, album, artist, song, link) {
        const imageBox = $('<div>').addClass('image-box').css('background-image', `url(${image})`);
        const albumLink = $('<a>').attr('href', link).text(album);
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
}
