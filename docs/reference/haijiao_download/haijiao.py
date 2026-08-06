import logging, asyncio, aiohttp, base64, json, random, re, js2py, os
from datetime import datetime
from aiohttp import TCPConnector
from aiohttp_socks import ProxyType, ProxyConnector, ChainProxyConnector
from main import loaddatadb, dumpdatadb, get_config
from aioweb import corelib, settings
from utils import m3u8_merge, thumbnails
import inspect
import pydl, main as t_main
import ffmpeg

def __LINE__():
    stack_t = inspect.stack()
    ttt = inspect.getframeinfo(stack_t[3][0])
    return ttt.lineno



def __FUNC__():
    stack_t = inspect.stack()
    ttt = inspect.getframeinfo(stack_t[2][0])
    return ttt.function


def __FILE__():
    stack_t = inspect.stack()
    ttt = inspect.getframeinfo(stack_t[2][0])
    return ttt.filename

def random_ip():
    a=random.randint(1,255)
    b=random.randint(1,255)
    c=random.randint(1,255)
    d=random.randint(1,255)
    return "%s.%s.%s.%s" % (str(a), str(b), str(c), str(d))

def random_Agent():
    agents = [
        "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36",
        "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:30.0) Gecko/20100101 Firefox/30.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/537.75.14",
        "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)",
        "Mozilla/5.0 (Windows; U; Windows NT 5.1; it; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11",
        "Opera/9.25 (Windows NT 5.1; U; en)",
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
        "Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.5 (like Gecko) (Kubuntu)",
        "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12",
        "Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9",
        "Mozilla/5.0 (X11; Linux i686) AppleWebKit/535.7 (KHTML, like Gecko) Ubuntu/11.04 Chromium/16.0.912.77 Chrome/16.0.912.77 Safari/535.7",
        "Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:10.0) Gecko/20100101 Firefox/10.0 ",
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:73.0) Gecko/20100101 Firefox/73.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36",
        "'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) snap Chromium/83.0.4103.116 Chrome/83.0.4103.116 Safari/537.36'"
    ]
    return random.choice(agents)

def add_header(text=True):
    base = {
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "Proxy-Connection": "keep-alive",
        "User-Agent": random_Agent()
        # ,"X-Forwarded-For":random_ip()
    }
    if not text:
        base["Accept-Encoding"] = "gzip, deflate, br"
    return base

def info(text, callback=logging.info):
    callback(f'{datetime.now().strftime("%Y-%m-%d %H:%M:%S")} {__LINE__()}-{__FUNC__()} INFO : {text}')

def error(text, callback=logging.error):
    callback(f'{datetime.now().strftime("%Y-%m-%d %H:%M:%S")} {__LINE__()}-{__FUNC__()} ERROR: {text}')

def warn(text, callback=logging.warning):
    callback(f'{datetime.now().strftime("%Y-%m-%d %H:%M:%S")} {__LINE__()}-{__FUNC__()} WARN : {text}')

async def download_task(url, params={}, *, headers={}, chunk_size=1024):
    resultObj={}
    connector = TCPConnector(ssl=False)
    proxy = get_config('proxy')
    if proxy:
        info(f'proxy: {proxy}')
        connector = ProxyConnector.from_url(proxy, verify_ssl=False)
    timeout = aiohttp.ClientTimeout(total=60)
    async with aiohttp.ClientSession(connector=connector, timeout=timeout, trust_env=True) as session:
        try:
            info(f"get: {url}, {params}")
            async with session.get(url, params=params, headers=headers) as resp:
                # print(resp.headers)
                if resp.status in (206, 200):
                    result = await resp.text()
                    resultObj['result'] = result 
                else:
                    warn(f'resp: {resp}')
        except BaseException as e:
            error(e)
            resultObj['error'] = str(e)
    return resultObj

def get_session():
    connector = TCPConnector(ssl=False)
    proxy = get_config('proxy')
    if proxy:
        info(f'proxy: {proxy}')
        connector = ProxyConnector.from_url(proxy, verify_ssl=False)
    timeout = aiohttp.ClientTimeout(total=60)
    return aiohttp.ClientSession(connector=connector, timeout=timeout, trust_env=True)

async def fetch(session, url, params={}, *, headers={}, chunk_size=1024):
    resultObj={}
    try:
        info(f"get: {url}, {params}")
        async with session.get(url, params=params, headers=headers) as resp:
            # print(resp.headers)
            if resp.status in (206, 200):
                result = await resp.text()
                resultObj['result'] = result 
            else:
                warn(f'resp: {resp}')
    except Exception as e:
        error(f'url: {url} => {e}')
        resultObj['error'] = str(e)
    finally:
        pass
    return resultObj


def validateJSON(jsonData):
  try:
    json.loads(jsonData)
  except ValueError as err:
    return False
  return True

def loaddata(filename):
    item = loaddatadb(filename, 'Downinfo')
    if item:
        return item.content

def dumpdata(filename, data):
    dumpdatadb({filename: {'key': filename, 'content': data}}, 'Downinfo')

async def getdata(filename, coroutine, *args, **kw):
    data = loaddata(filename)
    data = None
    if data is None:
        result = await coroutine(*args, **kw)
        data = result.get('result', '')
        dumpdata(filename, data)
    return data


async def parse(session, url):
    result = await fetch(session, url)
    # print(f'url: {url} => {result}')
    return await parseResult(session, url, result)

def parse_topic(data):
  index = 0
  while index < 20:
    index += 1
    data = base64.b64decode(data)
    if validateJSON(data):
      return json.loads(data.decode("utf-8"))


async def getRealUrl(session, remoteUrl):
    result = await fetch(session, remoteUrl)
    result = result.get('result', False)
    if not result:
        warn(f'get remoteUrl is null: {result}')
        return
    line = [line for line in result.split('\n') if not line.startswith('#')][0]
    code = line[0:line.rindex('.')-1]
    if line.startswith('http'):
        code = line[line.rindex('/')+1:line.rindex('.')-1]
    # return remoteUrl[0:remoteUrl.rindex('/')+1] + code + remoteUrl[remoteUrl.rindex('.'):]
    # re.sub(r'(\d*_i_preview)', '1076497_i', url)
    return re.sub(r'(\d*_i_preview)', code , remoteUrl)

async def getRealSrc(url, params={}, headers = {}):
    resultObj = {'code': 0}
    async with get_session() as session:
        try:
            info(f"post: {url}, {params}, {headers}")
            async with session.post(url, json=params, headers=headers) as resp:
                # print(await resp.text())
                if resp.status in (206, 200):
                    result = await resp.json()
                    resultObj['data'] = result 
                    resultObj['code'] = 1 
                else:
                    warn(f'resp: {resp}')
        except Exception as e:
            error(e)
            resultObj['error'] = f'Exception: {str(e)}'
            resultObj['code'] = -1
    return resultObj

async def parse_video_src(video_id, topid):
    data = {
        "id": video_id,
        "resource_id": topid,
        "resource_type": "topic",
        "line": ""
    }
    headers = {'X-User-Id': uid, 'X-User-Token': token}
    result = await getRealSrc(f"https://{host}/api/attachment", data, headers)
    print(result)
    if result['code'] != 1 or not result['data'].get('success', False): return {}
    result = result['data']
    if result.get('isEncrypted', False):
        result = parse_topic(result.get('data', ''))
    else:
        result = result.get('data', {})
    remoteUrl = result.get("remoteUrl")
    coverUrl = result.get("coverUrl")
    info(result)
    return {
        'poster': result.get('coverUrl', None), 
        'poster_local': f"poster/{pydl.utils.resource_path(coverUrl.replace('.txt', ''))}", 
        'src': f'https://{host}{remoteUrl}', 
        'src_local': f'video/{pydl.utils.resource_path("https://haijiao.com" + remoteUrl)}/{result.get("id")}.m3u8'
    }
    
async def parseResult(session, url, result={}):
    if result.get('result', False):
        result = result.get('result')
        if validateJSON(result):
            result = json.loads(result)
            if not result.get('success', False):
                warn(f'Failed: {result}')
                return []
            if result.get('isEncrypted', False):
                result = parse_topic(result.get('data', ''))
            else:
                result = result.get('data', {})
            title = result.get('title', '')
            user = result.get('user', {})
            attachments = result.get('attachments', [])
            if not attachments:
                warn(f'attachments is None: {attachments}')
                return []
            data_origin = {
                'name': title, 
                'url': url, 
                'path': '/haijiao', 
                'content_type': 'video', 
                'uid': str(user.get('id', '')), 
                'uname': user.get('nickname', '')
            }
            publish_date = result.get('createTime', datetime.now().strftime('%Y-%m-%d %H:%M:%S')).split(' ')[0].replace('-', '')
            data_origin['publish_date'] = publish_date
            datas = []
            # print(attachments)
            for item in attachments:
                # print({'id': str(item.get('id', '')), 'remoteUrl': item.get('remoteUrl', ''), 'category': item.get('category', '')})
                data = data_origin.copy()
                if item.get('category', '') == 'video':
                    info(item)
                    # remoteUrl = item.get('remoteUrl', '')
                    # coverUrl = item.get('coverUrl', '')
                    # remoteUrl = await getRealUrl(session, remoteUrl)
                    data['key'] = str(f"{result.get('topicId', '')}_{item.get('id', '')}")
                    data_info = await parse_video_src(item['id'], result['topicId'])
                    print(data_info)
                    info(data_info)
                    datas.append(dict(data, **data_info))
                    """
                    datas.append(dict(data, **{'key': str(item.get('id', '')), 'content_type': 'video', 
                        'src': remoteUrl, 'poster': coverUrl, 
                        'poster_local': f"poster/{os.path.basename(coverUrl).rsplit('.', 1)[0]}", 
                        'uid': str(user.get('id', '')), 'uname': user.get('nickname', ''), 
                        'publish_date': publish_date}))
                    """
                if item.get('category', '') == 'images':
                    pass
                    # info({'key': str(item.get('id', '')), 'poster': item.get('remoteUrl', ''), 'content_type': 'images'})
                if item.get('category', '') == 'audio':
                    data['key'] = str(f"{result.get('topicId', '')}_{item.get('id', '')}")
                    poster = "https://hjpic.hjpfe1.com/hjstore/system/node/nodeimg_804_1632990736.png"
                    data['poster'] = poster 
                    data['poster_local'] = f"poster/{pydl.utils.resource_path(poster)}"
                    src = item.get('remoteUrl', '')
                    data['src'] = src 
                    data['content_type'] = 'audio'
                    data['src_local'] = f'video/{pydl.utils.resource_path(src)}'
                    # print(data)
                    datas.append(data)
            # print(json.dumps(datas, ensure_ascii=False))
            print(datas)
            info(datas)
            return datas
        else:
            warn(json.dumps(result))
    return []

def test1():
    url = 'https://p.hjpfe1.com/hjstore/images/20220921/4187a2d6673b231840b3abd61a44bfee.jpg.txt'
    params = {}
    result = asyncio.run(download_task(url))
    if result.get('result', False):
      result = result.get('result')
      result = base64.b64decode(result+"=")
      with open('/data/poster/tmp.jpg', 'wb') as dst:
          dst.write(result)
    info(result)


async def parse_list(session, userId, *, page=1):
    result = []
    while page < 10:
        url = f'https://{host}/api/topic/node/topics?page={page}&userId={userId}&type=1'
        data = await getdata(f'{userId}_{page}', fetch, session, url)
        if not validateJSON(data):
            error(f'data is not json: {data}')
            break
        data = json.loads(data)
        if not data.get('success', False):
            error(f'Failed: {url} => {data}')
            break
        if data.get('isEncrypted', False):
            data = parse_topic(data.get('data', ''))
        else:
            data = data.get('data', {})
        page_ = data.get('page', {'page': 1, 'limit': 20, 'total': 0})
        info(f'url: {url}, page: {page_}')
        if not data.get('results', False):
            error(f'Failed: results is null => {data}')
            break
        topicIds = [item.get('topicId')for item in data.get('results', []) if item.__contains__('topicId')]
        if len(topicIds) <= 0:
            warn(f'topicIds is empty: {data}')
            break
        result += topicIds
        if page_.get('page') * page_.get('limit') >=  page_.get('total'): break
        page += 1
    return result


async def main_list(userId, *, page=1):
    result = []
    async with get_session() as session:
        # tasks = [asyncio.create_task(parse_list(session, userId, host=host))]
        topids = await parse_list(session, userId)
        # api = f'https://{host}/api/topic/'
        tasks = [asyncio.create_task(parse(session, f'https://{host}/api/topic/{topid}')) for topid in topids]
        if len(tasks) <= 0: return result
        done, pending = await asyncio.wait(tasks)
        for future in done:
            result += future.result()
    info(f'save: {result}')
    await save(result)
    return result
    
def test2():
    host = "hj6620a.com"
    userId = '167103565102'
    userId = '19459682'
    userId = '167103565102'
    userId = '19249406'
    userId = '20813398'
    # host = "hjaa3.top"
    # https://haijiao.com/homepage/23167891
    result = asyncio.run(main_list(userId))
    info(json.dumps(result, ensure_ascii=False))
    
async def save(items=[]):
    if len(items) <= 0: return
    keys = [item.get('key', '') for item in items]
    items_exists = await corelib.load_items('Porn91', in_={'key': keys})
    for item_ in items:
        for item in items_exists['items']:
            if item_['key'] == item['key']:
                item_['id'] = item['id']
                if item['status'] == 1:
                   item_["src_local"] = item["src_local"] 
                break
    print(corelib.save('Porn91', items))

async def main(topids = []):
    result = []
    headers = add_header()
    headers = dict(headers, **{'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'})
    
    async with get_session() as session:
        api = f'https://{host}/api/topic/'
        tasks = [asyncio.create_task(parse(session, api + topid)) for topid in topids]
        done, pending = await asyncio.wait(tasks)
        for future in done:
            result += future.result()
    print(f'save: {result}')
    await save(result)
    return result

# asyncio.run(main(['1197644']))    

# host = 'hjc472.top'
# print(asyncio.run(parse_video_src(7356222, 1215493)))


jscode = r'''
function w() {
    var e = "ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890"
        , t = (this.encode = function(i) {
        var a, n, o, r, s, c, l = "", u = 0;
        for (i = t(i); u < i.length; )
            o = (a = i.charCodeAt(u++)) >> 2,
            r = (3 & a) << 4 | (a = i.charCodeAt(u++)) >> 4,
            s = (15 & a) << 2 | (n = i.charCodeAt(u++)) >> 6,
            c = 63 & n,
            isNaN(a) ? s = c = 64 : isNaN(n) && (c = 64),
            l = l + e.charAt(o) + e.charAt(r) + e.charAt(s) + e.charAt(c);
        return l;
    } , this.decode = function(t) {
        var a, n, o, r, s, c, l = "", u = 0;
        for (t = t.replace(/[^A-Za-z0-9\*\#]/g, ""); u < t.length; )
            o = e.indexOf(t.charAt(u++)),
            a = (15 & (r = e.indexOf(t.charAt(u++)))) << 4 | (s = e.indexOf(t.charAt(u++))) >> 2,
            n = (3 & s) << 6 | (c = e.indexOf(t.charAt(u++))),
            l += String.fromCharCode(o << 2 | r >> 4),
            64 != s && (l += String.fromCharCode(a)),
            64 != c && (l += String.fromCharCode(n));
        return i(l)
    } , function(e) {
        e = e.replace(/\r\n/g, "\n");
        for (var t = "", i = 0; i < e.length; i++) {
            var a = e.charCodeAt(i);
            a < 128 ? t += String.fromCharCode(a) : t = 127 < a && a < 2048 ? (t += String.fromCharCode(a >> 6 | 192)) + String.fromCharCode(63 & a | 128) : (t = (t += String.fromCharCode(a >> 12 | 224)) + String.fromCharCode(a >> 6 & 63 | 128)) + String.fromCharCode(63 & a | 128)
        }
        return t
    }), i = function(e) {
        for (var t, i, a = "", n = 0, o = 0; n < e.length; )
            (t = e.charCodeAt(n)) < 128 ? (a += String.fromCharCode(t),
            n++) : 191 < t && t < 224 ? (o = e.charCodeAt(n + 1),
            a += String.fromCharCode((31 & t) << 6 | 63 & o),
            n += 2) : (o = e.charCodeAt(n + 1),
            i = e.charCodeAt(n + 2),
            a += String.fromCharCode((15 & t) << 12 | (63 & o) << 6 | 63 & i),
            n += 3);
        return a
    }
}
function o(a) {
    return (new w).decode(a);
}
'''

def load_js():
    js = js2py.EvalJs()
    js.execute(jscode)
    return js

async def parse_img(session, url):
    result = await fetch(session, url)
    if result.get('result', False):
        result = result.get('result', '')
        js = load_js()
        result = js.o(result)
        # print(result )
        # '''
        filename = os.path.basename(url).rsplit('.', 1)[0]
        with open(f'/data/poster/haijiao.jpeg', 'wb') as dst:
            dst.write(base64.b64decode(result.split('base64,', 1)[1]))
        '''
        with open(f'/data/poster/haijiao.jpeg', 'wb') as dst:
            dst.write(base64.b64decode(result.split('base64,', 1)[1]))
        print("保存完成")
        '''
    else:
        warn(f'Failed: {result}')
    return []

async def main_img(url):
    result = []
    async with get_session() as session:
        tasks = [asyncio.create_task(parse_img(session, url))]
        done, pending = await asyncio.wait(tasks)
        if done is not None:
            for future in done:
                result += future.result()
    return result
# asyncio.run(main_img("https://p.hjpfe1.com/hjstore/images/20240213/2dc228220129d81ea4c5d5b6f959e9bd.jpg.txt"))

async def get_domain(url):
    result = []
    connector = TCPConnector(ssl=False)
    proxy = get_config('proxy')
    if proxy:
        info(f'proxy: {proxy}')
        connector = ProxyConnector.from_url(proxy, verify_ssl=False)
    timeout = aiohttp.ClientTimeout(total=60)
    async with aiohttp.ClientSession(connector=connector, timeout=timeout, trust_env=True) as session:
        data = await fetch(session, url)
        data = data.get('result', '')
        if not validateJSON(data):
            print(f'data is not json: {data}')
            return
        data = json.loads(data)
        if not data.get('success', False):
            print(f'Failed: {url} => {data}')
            return
        if data.get('isEncrypted', False):
            data = parse_topic(data.get('data', ''))
        print(data)
        print(f"domain: {data.get('data', {}).get('domain', '')}")
        print(f"domain: {data.get('domain', '')}")
    return result
    

def test4():
    pass
    # https://www.haijiao.pro/api/login/conf
    url = 'https://www.haijiao.pro/api/login/conf'
    url = 'https://www.haijiao.com/api/login/conf'
    result = asyncio.run(get_domain(url))
# test4()

def test3():
    # 参考[海角社区脚本](https://sleazyfork.org/zh-CN/scripts/462265-%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E8%84%9A%E6%9C%AC/feedback?page=2)
    host = "hj6620a.com"
    #host = "hjaa3.top"
    topids = [
        # "722638",  "720325",
        # "723093", "764529"
        # "4943979"
        "1185803"
    ]
    result = asyncio.run(main(topids))
    info(json.dumps(result, ensure_ascii=False))


def test5():
    url = 'https://haijiao.store/mp4/20220115_0920d37d8f2ddab14e388910a6621b37_26096_i_preview.m3u8'
    result = re.findall(r'(\d*_i_preview)', url)
    if result:
        print(result)
    print(re.sub(r'(\d*_i_preview)', '1076497_i', url))

'''
if __name__ == '__main__':
    pass
    # test1()
    # print(await getRealUrl('https://p.hjpfe1.com/hjstore/video/20220316/dcb94ce628d2163a1f4fa10eb01e2d08/35967_i_preview.m3u8'))
    # test2()
    test3()
    # test4()
    # test5()
'''

async def load_img(url: str):
    async with get_session() as session:
        result = await fetch(session, url)
        if result.get('result', False):
            result = result.get('result', '')
            js = load_js()
            result = js.o(result)
            return base64.b64decode(result.split('base64,', 1)[1])
    return None

async def duration_mp3(src):
    duration = float(ffmpeg.probe(src)['format']['duration'])

async def download_keys(keys):
    import db
    session = db.create_session()
    # items = await corelib.load_items('Porn91', in_={'key': keys})
    # items = items.get('items', [])
    items = [item.single_to_dict() for item in session.query(db.Porn91).filter(db.Porn91.key.in_(keys))]
    print(items )
    if len(items) <= 0:
        return {'code': -1, 'field': 'items', 'msg': 'items is empty'}
    for index, item in enumerate(items, start=1):
        try:
            key = item.get("key", None)
            if key is None:
                logging.warning(f'[skip] key is null: {item}')
                continue
            logging.info(f'[-] task[{key}] {index}/{len(items)}')
            if item.get('status', -1) == 1:
                logging.warning(f'[skip] task[{key}] status is 1: {item}')
                continue
            if item.get('src', None) is None:
                logging.warning(f"[skip] task[{key}] src is null: {item}")
                continue
            data = {key: {"key": key, "status": 0}}
            logging.info(f'[-] dump {key}: {data}')
            dumpdatadb(data, "Porn91")
            proxy = get_config('proxy')
            
            pydl.api.loaddata = t_main.loaddata
            pydl.api.dumpdata = t_main.dumpdata
            
            src_local_abs = os.path.join(settings.config["base_dir"], item['src_local'])
            logging.info(f'[clear] {src_local_abs}.json: {t_main.deletedata(f"{src_local_abs}.json")}')
            if item['src_local'] is not None:
                if item['content_type'] == "audio":
                    result = await pydl.api.download(item['src'], src_local_abs, pydl.download.new_file_infos, proxy=proxy, verbose=False)
                    info(result)
                else:
                    result = await pydl.api.download(item['src'], src_local_abs, pydl.m3u8.new_m3u8_infos, proxy=proxy, verbose=False)
                    info(result)
                    src_local_abs = await m3u8_merge(f'{src_local_abs.rsplit(".", 1)[0]}.m3u8')
                    src_local = f"{item['src_local'].rsplit('.', 1)[0]}.mp4"
                    item['src_local'] = src_local
                    
            # 生成预览文件并获取时长
            if item["content_type"] == "video":
                duration = await thumbnails(src_local_abs)
            if item["content_type"] == "audio":
                duration = await duration_mp3(src_local_abs)
            
            item['duration'] = duration
            item['size'] = result.get("Size", 0)
            item['status'] = 1
            if item.get('poster', None):
                poster_local_abs = os.path.join(settings.config["base_dir"], item['poster_local'])
                if item['poster'].endswith(".txt"):
                    os.makedirs(os.path.dirname(poster_local_abs), exist_ok=True)
                    with open(poster_local_abs, 'wb') as dst:
                        data = await load_img(item['poster'])
                        if data:
                            dst.write(data)
                    if not os.path.exists(poster_local_abs):
                        logging.warning(f'[-] task[{key}] poster_local_abs not exists: {poster_local_abs}')
                elif not os.path.exists(poster_local_abs):
                    result = await pydl.api.download(item['poster'], poster_local_abs, pydl.download.new_file_infos, proxy=proxy, verbose=False)
                    info(result)
            print(item)
        except Exception as e:
            logging.error(f'[{key}]ERROR: {corelib.printException(e)}')
            if "Event loop stopped" in str(e):
                item['status'] = -1
                logging.info(f'[-] dump {key}: {item}')
                corelib.save('Porn91', [item])
                break
            item['status'] = -2
        logging.info(f'[-] dump {key}: {item}')
        corelib.save('Porn91', [item])


token = '2afefc9161cc4b52869032dd20b73cdc'
uid = '168149806501'

host = 'haijiao.pro'
host = 'haijiao.com'
host = 'hjc0e1.top'
host = 'h2j5jedd8a.top'
# asyncio.run(main(['1518004']))  
# asyncio.run(download_keys([9184056_1518004]))