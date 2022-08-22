//J'initie un tableau vide qui sera utilisé tout au long du processus afin de filtrer les tags.
let tagFiltered = [];

// Boucle sur les données.
async function init() {
    // Affichage par défaut de toutes les recettes au chargement de la page.
    displayRecipes(recipes);

    // tri par mot clé
    searchInput();

    // J'initialise le tri des items(recette, type, tag filtré dans un tableau).
    displayDropdownItems(recipes, 'ingredients', tagFiltered);

    displayDropdownItems(recipes, 'appareils', tagFiltered);

    displayDropdownItems(recipes, 'ustensiles', tagFiltered);
}

init();

//Je créé une fonction qui génère les cartes recettes.
function generateCards(recettes) {
    // Pour chaque recette,
    recettes.forEach((recette) => {
        //Je joue la fonction qui créé les cartes de chaque recette.
        recipeCardsFactory(recette);
    });
}

//Fonction de normalisation des items.
function normalizeString(string) {
    const diacriticRegex = new RegExp(/\p{Diacritic}/, 'gu');
    const spaceRegex = new RegExp(/\s/, 'g');
    return string
        .normalize('NFD') // renvoie la chaîne sous forme Unicode normalisée avec décomposition des signes diacritiques (accents, trémas, cédilles, etc.)
        .replace(diacriticRegex, '') // Supprime les signes diacritiques(accents, trémas, cédilles, etc.).
        .toLowerCase()
        .replace(spaceRegex, ''); // Supprime tous les espaces.
}

//Je créé une fonction qui génère les items de chaque dropdown(tableau, bloc d'item et type).
function generateItems(array, itemBlock, type) {
    //Pour chaque tableau:
    array.forEach((item) => {
        //Je normalise les items(maj min accents espaces...)
        itemNormalized = normalizeString(item);
        //Je créé les paramètres d'affichage.
        //Je créé une section qui intégrera les tags.
        const itemsDOM = document.createElement('div');
        //J'ajoute une classe avec les params d'affichage et l'item sera normalisé.
        itemsDOM.classList = `col-3 item-${itemNormalized}`;
        //Au clic, le tag s'ajoute.
        itemsDOM.addEventListener('click', () => addTag(item, type));
        //J'affiche les items à l'écran.
        itemsDOM.innerHTML = item;

        //J'ajoute chacun un à un les un après les autres.
        itemBlock.appendChild(itemsDOM);
    });
}

// Gestion des animations sur les dropdowns.

// J'attend que la page se charge avant de travailler avec des éléments HTML.
window.addEventListener('load', () => {
    //A l'évènement clic:
    document.addEventListener('click', function (event) {
        // Pour chaque dropdown,
        document.querySelectorAll('.dropdowns').forEach(function (element) {
            // Je ferme toute liste déroulante qui n'est pas celle sur laquelle on vient de cliquer.
            if (element !== event.target) {
                element.classList.remove('col-lg-7');
                element.classList.add('col-lg-3');
                element.classList.add('col-xl-2');
                element.classList.add('rounded-bottom');
            }
        });
        // Je cache le dropdown à ceux qui ne sont pas cliqués.
        document.querySelectorAll('.dropdown-content').forEach(function (element) {
            // Je ferme toute liste déroulante qui n'est pas celle sur laquelle on vient de cliquer.
            if (element !== event.target) {
                //Je retire la classe show.
                element.classList.remove('show');
            }
        });
        //JE DOIS RETRAVAILLER CA FLECHE KO.
        // Pour chaque fleche up:
        document.querySelectorAll('.dropbtn .fa-chevron-up').forEach(function (element) {
            // Je ferme toute liste déroulante qui n'est pas celle sur laquelle on vient de cliquer.
            if (element !== event.target) {
                //J'ajoute la classe hide.
                element.classList.add('hide');
            }
        });
        //JE DOIS RETRAVAILLER CA FLECHE KO.
        // Pour chaque fleche down.
        document.querySelectorAll('.dropbtn .fa-chevron-down').forEach(function (element) {
            // Je ferme toute liste déroulante qui n'est pas celle sur laquelle on vient de cliquer.
            if (element !== event.target) {
                //Je retire la classe hide.
                element.classList.remove('hide');
            }
        });

        // Si je suis bien sur le dropdown cliqué:
        if (event.target.matches('.dropbtn')) {
            // J'affiche le dropdown (le plus proche).
            event.target.closest('.dropdowns').querySelector('.dropdown-content').classList.toggle('show');

            // J'ajoute les colonnes necessaires au plus proche.
            event.target.closest('.dropdowns').classList.add('col-lg-7');

            // Et je supprime celles qui ne sont plus necessaires ainsi que la bordure en dessous.
            event.target.closest('.dropdowns').classList.remove('col-xl-2');
            event.target.closest('.dropdowns').classList.remove('col-lg-3');
            event.target.closest('.dropdowns').classList.remove('rounded-bottom');
        }
    });
});

// GESTION DES TAGS

//Je créé une fonction qui permet de gérer les tags.
function tagFilter(tagFiltered) {
    //Je créé une variable qui implique les recettes.
    let recipesFiltered = recipes;

    // Si le tableau de tags n'est pas vide je filtre selon les tags.
    if (tagFiltered.length !== 0) {
        //Pour chaque tag filtré dans le tableau tagFiltered,
        tagFiltered.forEach((tag) => {
            //La variable correspondra à un tableau filtré par recette.
            recipesFiltered = recipesFiltered.filter((recette) => {
                // Je met en minuscule la valeur du tag pour bien comparer ensuite.
                tag.value = tag.value.toLowerCase();

                // INGREDIENTS
                //Si le type du tag est ingrédient,
                if (tag.type == 'ingredients') {
                    //Je créé une variable qui donnera la valeur fausse.
                    let ingredientfounded = false;
                    //On parcours le tableau rec.ingri=  quand i est inf la taille du tableau recette.ingredients, on ajoute 1.
                    for (let i = 0; i < recette.ingredients.length; i++) {
                        //Si l'ingredient en minuscule(i) correspond à la valeur du tag,
                        if (recette.ingredients[i].ingredient.toLowerCase() == tag.value) {
                            //L'ingr trouvé sera vrai.
                            ingredientfounded = true;
                            break;
                        }
                    }
                    //Si l'ingr trouvé est vrai,
                    if (ingredientfounded == true) {
                        //On retourne recette.
                        return recette;
                    }
                }
                // APPAREILS
                //Si le type du tag est appareil,
                if (tag.type == 'appareils') {
                    //Je créé une variable qui donnera la valeur fausse.
                    let appareilfounded = false;
                    //Si l'appareil en minuscule correspond à la valeur du tag,
                    if (recette.appliance.toLowerCase() == tag.value) {
                        //L'app trouvé sera vrai.
                        appareilfounded = true;
                    }
                    //Si l'app trouvé est vrai,
                    if (appareilfounded == true) {
                        //On retourne recette.
                        return recette;
                    }
                }
                // USTENSILES
                //Si le type du tag est ustensile,
                if (tag.type == 'ustensiles') {
                    //Je créé une variable qui donnera la valeur fausse.
                    let ustensilsfounded = false;
                    //On parcours le tableau rec.ust=  quand i est inf la taille du tableau recette.ustensils, on ajoute 1.
                    for (let i = 0; i < recette.ustensils.length; i++) {
                        //Si l'ingredient en minuscule(i) correspond à la valeur du tag,
                        if (recette.ustensils[i].toLowerCase() == tag.value) {
                            //L'ust trouvé sera vrai.
                            ustensilsfounded = true;
                            break;
                        }
                    }
                    //Si l'ust trouvé est vrai,
                    if (ustensilsfounded == true) {
                        //On retourne recette.
                        return recette;
                    }
                }
            });
        });
    }
    // Sinon, (si le tableau de tags est vide) je réutilise recipes.
    else {
        recipesFiltered = recipes;
    }

    // Je supprime les articles affichés avant de reboucler dessus et refaire un affichage filtré.
    //Pour chaque élément qui se trouve dans article-recette.
    document.querySelectorAll('.article-recette').forEach((element) => {
        //Je supprime l'élément.
        element.remove();
    });

    // Je réaffiche les recettes filtrées par tags grâce à la fonction generateCards avec comme argument: recette filtrée.
    generateCards(recipesFiltered);

    // Je rafraichis l'affichage des items dans les dropdowns.
    //J'appelle la fonction displayDropdownItems avec cette fois en paramètres le tableau recette filtrées, les types et le tableau tag filtré.
    displayDropdownItems(recipesFiltered, 'ingredients', tagFiltered);

    displayDropdownItems(recipesFiltered, 'appareils', tagFiltered);

    displayDropdownItems(recipesFiltered, 'ustensiles', tagFiltered);
    //Je joue la fonction errorMessage pour les recettes filtrées.
    errorMessage(recipesFiltered);
}

// AJOUT DU TAG
// Au clic sur un item, affichage du tag sur la page et ajout à la suite dans le tableau.

//Fonction qui ajoute un tag et un type
function addTag(itemTag, type) {
    // Je cree une variable qui correspondra aux tag qui seront "normalisés"(sans accents, sans espace, ... )
    itemTagNormalized = normalizeString(itemTag);

    //Je créé les paramètres d'affichage.
    //Je créé une section qui intégrera les tags.
    const tagItemDOM = document.createElement('div');
    //J'ajoute une classe avec les params d'affichage et l'item sera normalisé.
    tagItemDOM.classList = `rounded p-2 mb-3 tag-${type} tag-${itemTagNormalized.replace(
        /[&\/\\#,+()$~%.'":*?<>{}]/g,
        '',
    )}`;
    //J'ajoute un type.
    tagItemDOM.dataset.type = `${type}`;
    //J'ajoute une valeur.
    tagItemDOM.dataset.value = `${itemTag}`;
    //Je créé une section qui contiendra la croix.
    const crossItemDOM = document.createElement('i');
    //Je lui ajoute la classe correspondant à la croix dans Bootstrap.
    crossItemDOM.classList = 'bi bi-x-circle';
    //J'affiche l'item ainsi qu'un espace non seccable (qui ne se reduit pas).
    tagItemDOM.innerHTML = `${itemTag} &nbsp`;
    //Je dit que la croix est l'héritiere de l'endroit où sera affiché l'item.
    tagItemDOM.appendChild(crossItemDOM);
    //Je déclare où se trouve le tag actuel.
    let currentTag = document.querySelector('.filtres-actifs');
    //Et il herite de tagItemDOM.
    currentTag.appendChild(tagItemDOM);
    // const crossItemDOM = document.createElement('i');
    // crossItemDOM.classList = 'bi bi-x-circle';
    // tagItemDOM.innerHTML = `${itemTag} &nbsp`;
    // tagItemDOM.appendChild(crossItemDOM);
    crossItemDOM.addEventListener('click', () => {
        removeTag(type, itemTag);
    });
    //J'ajoute chacun des nouveaux tags un à un les un après les autres.
    // currentTag.insertAdjacentHTML('beforeEnd', tagItemDOM);

    // const tagItemDOM = document.createElement('div');

    // J'ajoute à la suite chaque nouveau tag en objet dans le tableau tagFiltered.
    tagFiltered.push({
        type: type,
        value: itemTag,
    });

    //Je joue la fonction tagFilter(tagFiltered)
    tagFilter(tagFiltered);
}

//Fonction qui supprime les tags.
function removeTag(type, value) {
    //Je met tout en minuscules.
    value = value.toLowerCase();

    //je cree une variable qui correspond aux valeurs normalisées (sans espaces, minusculles, sans accents...)
    valueClass = normalizeString(value);

    //Je recherche les elements qui se trouvent dans filtres-actifs, dans tag- j'ajoute la valueClass et je supprime.
    document
        .querySelector('.filtres-actifs .tag-' + valueClass.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ''))
        .remove();

    //tagFiltered correspond  au tag du tableau tagFiltered qui est maintenant filtré de cette facon: la valeur de tag ne correspond pas à la valeur.
    tagFiltered = tagFiltered.filter((tag) => tag.value !== value);

    //On joue la fonction tagfilter.
    tagFilter(tagFiltered);
}

//Fonction qui affichera un message d'erreur
function errorMessage(recettes) {
    // si il n'y à aucune recette trouvée j'affiche un message d'erreur
    if (recettes.length == 0) {
        //Je retire la classe "hide" à la section de classe "no-recipes".
        document.querySelector('.no-recipes').classList.remove('hide');
    } else {
        //Sinon j'ajoute la section "hide" à la section de classe "no-recipes".
        document.querySelector('.no-recipes').classList.add('hide');
    }
}
