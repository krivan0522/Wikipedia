import axios from 'axios';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

const defaultParams = {
  format: 'json',
  origin: '*',
  action: 'query',
  prop: 'extracts|revisions|info|pageimages|categories',
  explaintext: true,
  exintro: true,
  piprop: 'original',
  rvprop: 'timestamp|user|comment|content',
  inprop: 'url',
  cllimit: 'max',
};

// Search API
export const searchArticles = async (query) => {
  try {
    const response = await axios.get(WIKIPEDIA_API_URL, {
      params: {
        ...defaultParams,
        action: 'query',
        list: 'search',
        srsearch: query,
        srlimit: 10,
      },
    });
    return response.data.query.search;
  } catch (error) {
    console.error('Error searching articles:', error);
    throw error;
  }
};

// Article API
export const getArticle = async (title) => {
  try {
    // First get the page info
    const pageResponse = await axios.get(WIKIPEDIA_API_URL, {
      params: {
        ...defaultParams,
        titles: title,
        prop: 'info|pageimages|categories',
        inprop: 'url',
        piprop: 'original',
      },
    });

    const pageId = Object.keys(pageResponse.data.query.pages)[0];
    const page = pageResponse.data.query.pages[pageId];

    if (page.missing) {
      throw new Error('Article not found');
    }

    // Then get the parsed content
    const parseResponse = await axios.get(WIKIPEDIA_API_URL, {
      params: {
        format: 'json',
        origin: '*',
        action: 'parse',
        page: title,
        prop: 'text|sections',
        formatversion: 2,
      },
    });

    const parsedContent = parseResponse.data.parse;
    
    // Extract sections
    const sections = parsedContent.sections.map(section => ({
      id: section.anchor,
      level: section.level,
      text: section.line,
    }));

    return {
      title: page.title,
      content: parsedContent.text,
      sections,
      categories: page.categories?.map(cat => cat.title.replace('Category:', '')),
      image: page.original?.source,
      url: page.fullurl,
      lastModified: page.touched,
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

// Random Article API
export const getRandomArticle = async () => {
  try {
    const response = await axios.get(WIKIPEDIA_API_URL, {
      params: {
        ...defaultParams,
        action: 'query',
        list: 'random',
        rnnamespace: 0,
        rnlimit: 1,
      },
    });
    const randomTitle = response.data.query.random[0].title;
    return getArticle(randomTitle);
  } catch (error) {
    console.error('Error fetching random article:', error);
    throw error;
  }
};

// Featured Articles API
export const getFeaturedArticles = async () => {
  try {
    const response = await axios.get(WIKIPEDIA_API_URL, {
      params: {
        ...defaultParams,
        action: 'query',
        generator: 'categorymembers',
        gcmtitle: 'Category:Featured_articles',
        gcmlimit: 10,
        prop: 'extracts|pageimages',
        exintro: true,
        explaintext: true,
        piprop: 'original',
      },
    });

    const pages = response.data.query?.pages;
    if (!pages) return [];

    return Object.values(pages).map(page => ({
      title: page.title,
      extract: page.extract,
      image: page.original?.source,
    }));
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    throw error;
  }
};

// News API
export const getNews = async () => {
  try {
    const response = await axios.get(WIKIPEDIA_API_URL, {
      params: {
        ...defaultParams,
        action: 'query',
        list: 'categorymembers',
        cmtitle: 'Category:Current_events',
        cmlimit: 5,
      },
    });
    
    const pages = response.data.query?.categorymembers;
    if (!pages) return [];
    
    return pages.map(page => ({
      title: page.title,
      timestamp: page.timestamp,
    }));
  } catch (error) {
    console.error('Error getting news:', error);
    throw error;
  }
};

// On This Day API
export const getOnThisDay = async () => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    const response = await axios.get(WIKIPEDIA_API_URL, {
      params: {
        ...defaultParams,
        action: 'query',
        list: 'categorymembers',
        cmtitle: `Category:${month}_${day}`,
        cmlimit: 5,
      },
    });
    
    const pages = response.data.query?.categorymembers;
    if (!pages) return [];
    
    return pages.map(page => ({
      title: page.title,
      timestamp: page.timestamp,
    }));
  } catch (error) {
    console.error('Error getting on this day:', error);
    throw error;
  }
};

// Article History API
export const getArticleHistory = async (title) => {
  try {
    const response = await axios.get(WIKIPEDIA_API_URL, {
      params: {
        ...defaultParams,
        action: 'query',
        prop: 'revisions',
        titles: title,
        rvlimit: 50,
        rvprop: 'timestamp|user|comment|content',
      },
    });
    
    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId].revisions || [];
  } catch (error) {
    console.error('Error getting article history:', error);
    throw error;
  }
};

// Categories API
export const getCategories = async (title) => {
  try {
    const response = await axios.get(WIKIPEDIA_API_URL, {
      params: {
        ...defaultParams,
        action: 'query',
        prop: 'categories',
        titles: title,
        cllimit: 50,
      },
    });
    
    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId].categories?.map(cat => cat.title.replace('Category:', '')) || [];
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
}; 