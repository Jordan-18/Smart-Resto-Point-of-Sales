export const setSession = (key, value, ttl = 7 * 24 * 60 * 60 * 1000) => {
    const now = new Date();
  
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
  
    localStorage.setItem(key, JSON.stringify(item));
};

export const getSession = key => {
    const itemString = localStorage.getItem(key);
  
    if (!itemString) {
      return null;
    }
  
    const item = JSON.parse(itemString);
    const now = new Date();
  
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
  
    return item.value;
};

export const removeSession = key => {
    localStorage.removeItem(key);
}