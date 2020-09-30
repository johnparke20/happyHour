import requests
from urllib.parse import urljoin, urlparse
import urllib3
from bs4 import BeautifulSoup
import os
from tqdm import tqdm


def is_valid(url):
    """
    Checks whether `url` is a valid URL.
    """
    parsed = urlparse(url)
    return bool(parsed.netloc) and bool(parsed.scheme)

def get_to_menu(url):
    print(url)
    soup = BeautifulSoup(requests.get(url,verify=False).content, "html.parser")
    for img in tqdm(soup.find_all("a"), "Extracting links"):
        print(img)
        link = img.attrs.get("href")
        if not link:
            continue
        if "happy_hour" not in link and "happy-hour" not in link and "specials" not in link:
            continue
        img_url = urljoin(url, link)
        print(img_url)
        return img_url
    for img in tqdm(soup.find_all("a"), "Extracting links"):
        link = img.attrs.get("href")
        if not link:
            continue
        if "menu" not in link and "drinks" not in link:
            continue
        img_url = urljoin(url, link)
        print(img_url)
        return img_url

def get_menu_imgs(url):
    soup = BeautifulSoup(requests.get(url, verify=False).content, "html.parser")
    urls=[]
    for img in tqdm(soup.find_all("img"), "Extracting links"):
        link = img.attrs.get("src")
        if not link:
            continue
        img_url = urljoin(url, link)
        urls.append(img_url)
        print(img_url)
    return urls

def download(url, pathname):
    """
    Downloads a file given an URL and puts it in the folder `pathname`
    """
    # if path doesn't exist, make that path dir
    if not os.path.isdir("src/assets/"+pathname.split("/")[2]):
        os.makedirs("src/assets/"+pathname.split("/")[2])
    # download the body of response by chunk, not immediately
    response = requests.get(url, verify=False, stream=True)
    # get the total file size
    file_size = int(response.headers.get("Content-Length", 0))
    # get the file name
    filename = os.path.join("src/assets/"+pathname.split("/")[2], url.split("/")[-1])
    # progress bar, changing the unit to bytes instead of iteration (default by tqdm)
    progress = tqdm(response.iter_content(1024), f"Downloading {filename}", total=file_size, unit="B", unit_scale=True, unit_divisor=1024)
    with open(filename, "wb") as f:
        for data in progress:
            # write data read to the file
            f.write(data)
            # update the progress bar manually
            progress.update(len(data))


if __name__ == "__main__":
    urls=[]
    with open('sites.txt', 'r') as f:
      for item in f:
        urls.append(item.strip())
    for site in urls:
        try:
            menuLink = get_to_menu(site)
            menu = get_menu_imgs(menuLink)
            for item in menu:
                download(item,site)
        except(Exception):
            print("No easy access link")
