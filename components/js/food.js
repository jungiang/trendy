class Food{
    constructor( ){
        this.latitude = null;
        this.longitude = null;
        this.ajaxObj = null;
        this.nextTen = [];
        this.mainContent = $('#main-content');

        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.savePosition = this.savePosition.bind(this);
        this.getDataFromServer = this.getDataFromServer.bind(this);
        this.dealData = this.dealData.bind(this);
        this.popUpImg = this.popUpImg.bind(this);
        this.addMoreResults = this.addMoreResults.bind(this);

        this.callback = {
            img: this.popUpImg
        }

        const loader = $('<div>').addClass('loader');
        const pageLoader = $('<div>').addClass('page-loader').append(loader);
        $('#main-content').append(pageLoader);
    }
    popUpImg(content){
        const imageUrl = `url('${content.contentBox.imgBox.url}')`;
        const picture = $('<div>').addClass('picture');
        picture.css('background-image', imageUrl);
        const modal = new Modal(picture);
    }
    getDataFromServer(){
        const ajaxObj = {
            "async": true,
            "crossDomain": true,
            "url": "components/api/yelpproxy.php",
            data: {
                term: 'dessert',
                attribute: 'hot_and_new',
                sort_by: 'rating'
            },
            "method": "GET",
            "headers": {
            "apikey": "LYh8aLnK3aKVWOQycd5DzPTTrzZg1JY_DYYxs_2YPhIKd9ZpJfE8qR0TRS6nTfzUbGp5Rc5PgnwuBotVWQsyH1BNTr-m4KQxpgEqPPnBgQoV1tT17HTU1Rvu2zWQXHYx",
            "cache-control": "no-cache",
            },
            dataType: 'json',
            success: this.dealData,
            error: this.handleError
        };
        if(this.latitude && this.longitude){
            ajaxObj.data.latitude = this.latitude;
            ajaxObj.data.longitude = this.longitude;
        } else {
            ajaxObj.data.location = 'orange county';
        }
        $('.page-loader').show();
        this.generateSearchData(ajaxObj);
    }
    generateSearchData(ajaxObj){
        $.ajax(ajaxObj);
    }
    dealData(response){
        $('.page-loader').hide();
        const business = response.businesses;
        for(let i=0; i < business.length; i++){
            const newContent = new FoodContent(business[i], this.callback);
            if(i < 10){
                this.render(newContent.makeNewContent(i)); 
            } else {
                this.nextTen.push(newContent.makeNewContent(i));
            }
            
        }   
    }
    render(content){
        this.mainContent.append(content);
    }
    handleError(){
        $('.page-loader').hide();
        const errorimg = $('<img>').attr({
            'src': 'components/css/images/serverdown.png',
            'width' : '100%'
            });
        const errorMessage = $('<div>').addClass('error-message');
        errorMessage.append(errorimg);
        const errorContainer = $('<div>').addClass('error-container').append(errorMessage);
        $('#main-content').append(errorContainer);
    } 
    getCurrentLocation(){
        navigator.geolocation.getCurrentPosition(this.savePosition);
    }
    savePosition(pos){
        const crd = pos.coords;
        this.latitude = crd.latitude;
        this.longitude = crd.longitude;
    }
    addMoreResults(){
        $('add-button').remove();
        for( let index=0; index < this.nextTen.length; index++){
            this.render(this.nextTen[index]);
        }
    }
    addMoreResultsButton(){
        const addButton = $('<button>').addClass('add-button').text('Show More').on('click', this.addMoreResults);
        this.render(addButton);
    }    
}

