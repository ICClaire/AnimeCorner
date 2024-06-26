let page = 1; // Current page number
        let limit = 6; // Results per page

        // Selects element from the DOM and assigns to a new variable
        // Helps make it more interactive using Javascript

        const loader = document.querySelector('.loader');
        const viewMore = document.querySelector('.view-more');
        
        // creates where the data will be put into
        const bigContainer = document.querySelector('.container-1');
        const container = document.querySelector('.full-result');


        // The loader is originally displayed as 'none'
        // Created two functions for when I want the loader to show up, will call the function later when the loader is needed
        function displayLoader(){
            loader.classList.add("active")
            
        }

        // The viewMore button is initially displayed as none and I wanted it to show after the loading is done
        function removeLoader(){
            loader.classList.remove("active");
        }

        // loadList function helps me integrate an API using the fetch() method 
        function loadList(){

            // Since I had a search bar, I wanted to make the result of my data be the same, therefore I incorporated to what ever value it has to the api
            // Created a new variable for the search input from the DOM so that I can manipulate it in JS
            // trim() allows the search to be more clear and concise and just removes any additional spaces it may have from the search value
            const searchInput = document.getElementById('searchInput').value.trim();

            // created a seperate variable for the api so I can console.log without any convenience later on
            // since I wanted to incorporate the value of my search input, I needed to make sure that the api url is encoded properly with the value. 
            // page helps represent which page the result will be and the limit helps showcase how many data will show depending on what page it is on
            const uri = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchInput)}&page=${page}&limit=${limit}`;

            // calling the loader to indicate the data is being coming
            displayLoader();

            // uses a GET request using the fetch method to the API which then converts it to JSON format
            fetch(uri)
                .then(
                    response => response.json()
                )
                // after the data is ready, it is kept in the parameter
                .then((data) => {
                    console.log(data);
                    // removes the loader when the data is ready
                    removeLoader();
                    // shows the data in the DOM
                    displayProducts(data.data);
                    // a condition to when if the data is equal to the limit given above then more data of the next page will be added
                    if(data.data.length ===  limit){
                        page++;
                        viewMore.classList.add("active");
                        //adjusts the height of the container to help put in more data later on
                    } else {
                        // if there is less than the limit related to data of the anime the viewMore will remain hidden
                        viewMore.classList.remove("active");
                    }

                })
                // catches errors
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    // additional code 
                });

        }

        // Function that displays the data to the DOM which is passed on to the result parameter
        function displayProducts(result) {

            // loops each anime item in the result array
            for (let i = 0; i < result.length; i++){

                // creates a box for the anime information
                var box = document.createElement('div');
                box.classList.add('anime-info');
                

                // creates a template for where the image will be
                var imgbox = document.createElement('div');
                imgbox.classList.add('hero-img');
                
                // creates the name of the element and [i] contains the name information from the data above
                var name = document.createElement('div');
                name.innerHTML = "Name: " + result[i].title;
                name.classList.add('anime-name');
                name.style.fontWeight = 'bold';
                name.style.marginBottom = 15 + 'px';

                // creates a div for how many episodes
                var episodes = document.createElement('div');
                episodes.innerHTML = "Episodes: " + result[i].episodes;

                // creates an image which is then added on to where the image template is
                var image = document.createElement('img');
                image.classList.add('rounded-t-lg');
                image.src = result[i].images.jpg.image_url;
                image.alt = result[i].title;
                imgbox.appendChild(image);

                // creates an anchor link of the data url
                // target is used so the url will be opened in another tab
                var url = document.createElement('a');
                url.classList.add=('anime-link')
                url.href = result[i].url;
                url.target = "_blank";
                url.textContent = result[i].url;

                // all lines are added and created in the box container
                box.appendChild(name);
                box.appendChild(imgbox);
                box.appendChild(episodes);
                box.appendChild(url).innerHTML = "View in Anime List";

                // the box is then added to the container itself to display the data
                container.appendChild(box);
            }

            // the main container helps adjusts to the anime container by returning its height
            // this ensures that the anime container is properly placed inside the main container
            bigContainer.style.height = container.scrollHeight + 'px';


        }

        // function is used for when the user presses the 'enter' key for searching up animes
        // event parameter is used to get the information about the event
        function enter(event) {
            
            // uses a condition that helps indicate whether there is something inside the search bar or not
            // if there is something inside the search bar then the loadList() function is called to show the data
            // to help clear the previous search, the container is changed in the DOM to an empty string and then loads the new content
            if (event.key === 'Enter' && searchInput.value.trim().length > 0) {
                container.innerHTML='';
                loadList(); 
            } 
        }

        // addEventListener is used when the user pressed the 'Enter' key from the search bar
        document.getElementById('searchInput').addEventListener('keypress', enter);