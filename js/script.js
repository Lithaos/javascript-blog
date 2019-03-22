'use strict';
const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-',
  authorsListSelector: '.list.authors'
}

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [IN PROGRESS] add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleLink = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleLink);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}



function generateTitleLinks(customSelector = '') {
  /* remove contents of titleList */
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  let html = '';
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    html = html + linkHTML;
  }

  /* insert link into titleList */
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {
    min: 999999,
    max: 0,
  };
  for (let tag in tags) {
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }

  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) + 1);
  return classNumber;
}

function generateTags() {
  /* Create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    let tagsWrapper = article.querySelector(opts.articleTagsSelector);
    tagsWrapper.innerHTML = '';
    let html = '';
    /* get tags from data-tags attribute */
    let tags = article.getAttribute('data-tags');
    /* split tags into array */
    tags = tags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of tags) {
      /* check if this link is NOT already in allTags */
      const linkHTML = '<li><a href="#tag-' + tag + '"> ' + tag + ' </a></li> ';
      if (!allTags.hasOwnProperty(tag)) {
        /* add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
      html = html + linkHTML;
    }
    tagsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* find list of tags in right column */
  const tagList = document.querySelector(opts.tagsListSelector);
  /* Create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  let allTagsHTML = '';
  /* START LOOP: for each tag in allTags:*/
  for (let tag in allTags) {
    /* generate code of a link and add it to allTagsHTML */
    allTagsHTML += '<li><a href="#tag-' + tag + '"' + 'class="' + opts.cloudClassPrefix + calculateTagClass(allTags[tag], tagsParams) + '"> ' + tag + ' </a></li>';
    /* End loop: for each tag in allTags: */
  }
  /* add html from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
}

generateTags();


function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const tags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let eachTag of tags) {
    /* remove class active */
    eachTag.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagHref = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let tag of tagHref) {
    /* add class active */
    tag.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const links = document.querySelectorAll('.post-tags a');
  /* START LOOP: for each link */
  for (let link of links) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find author wrapper */
    let authorWrapper = article.querySelector(opts.articleAuthorSelector);
    authorWrapper.innerHTML = '';
    /* get author from data-author attribute */
    let author = article.getAttribute('data-author');
    /* generate HTML of the link */
    const linkHTML = 'by <a href="#' + author + '"> ' + author + ' </a>';
    /* insert HTML of author link into the author wrapper */
    if (!allAuthors.hasOwnProperty(author)) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }

    authorWrapper.innerHTML = linkHTML;
    /* END LOOP: for every article: */
  }
  const authorList = document.querySelector(opts.authorsListSelector);
  const authorParams = calculateTagsParams(allAuthors);
  let allAuthorsHTML = '';
  for (let author in allAuthors) {
    allAuthorsHTML += '<li><a href="#' + author + '"' + 'class="' + opts.cloudClassPrefix + calculateTagClass(allAuthors[author], authorParams) + '"> ' + author + ' </a></li>';
  }
  authorList.innerHTML = allAuthorsHTML
}

generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* find all authors links with class active */
  const authors = document.querySelectorAll('a.active[href^="#"]');
  /* START LOOP: for each active tag link */
  for (let aurhor of authors) {
    /* remove class active */
    aurhor.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const authorHref = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let author of authorHref) {
    /* add class active */
    author.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + href.replace('#', '') + '"]');
}

function addClickListenersToAuthors() {
  /* find all links to authors */
  const links = document.querySelectorAll(opts.articleAuthorSelector + ' a');
  /* START LOOP: for each link */
  for (let link of links) {
    /* add authorClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
  }
}
addClickListenersToAuthors();