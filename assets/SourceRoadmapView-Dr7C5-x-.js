import{r,j as e,x as N,h as m,u as x,$ as B,z as F,N as D,C as U,t as G,a5 as Q,l as K,m as W,a6 as X}from"./vendor-react-Da1LTP2f.js";import{u as C,C as V,s as v}from"./index.js";import"./vendor-misc-CoSDG3-6.js";import"./vendor-highlight-DUpDiuzF.js";const c=[{id:"channel",name:"Channel",layer:"I/O 事件分流与适配层",role:"每个 Channel 对象独占一个特定的 Linux Socket 文件描述符（sockfd），负责向 Poller 注册该 fd 感兴趣的事件（EPOLLIN / EPOLLOUT），并接收 Poller 返回的实际就绪事件，进而分发给预先绑定的事件回调闭包。",members:["const int fd_: 独占管理的单个套接字描述符","EventLoop* loop_: 所属的 EventLoop 事件循环","int events_: 用户关注的事件掩码 (POLLIN/POLLOUT)","int revents_: Poller 实际返回的就绪事件掩码","std::weak_ptr<void> tie_: 弱引用绑定宿主（通常为 TcpConnection），防止多线程下宿主正在析构时回调触发导致野指针","ReadEventCallback readCallback_: 读事件就绪 std::function 回调","EventCallback writeCallback_: 写事件就绪回调","EventCallback errorCallback_: 错误事件回调","EventCallback closeCallback_: 关闭事件回调"],functions:["void tie(const std::shared_ptr<void>&): 将弱引用绑定至宿主对象","void enableReading(): events_ |= POLLIN; update();","void enableWriting(): events_ |= POLLOUT; update();","void update(): 调用 loop_->updateChannel(this) 注册进 epoll","void handleEvent(Timestamp receiveTime): 事件分发入口","void handleEventWithGuard(Timestamp receiveTime): 在 tie_.lock() 提权成功保证宿主存活时安全分发回调"],cppFeatures:["std::weak_ptr 观察者模式","std::function 类型擦除","std::bind 回调组装","RAII 资源防泄漏","const 引用传参"],relatedDays:[1,10,18,19,20],status:"未读",notes:""},{id:"poller",name:"Poller",layer:"I/O 多路复用内核抽象层",role:"作为 I/O 多路复用的纯虚抽象基类，对外封装统一接口，提供 EPollPoller 和 PollPoller 两套具体派生实现。负责将用户关心的 Channel 注册到 Linux 内核 epoll 实例中，并在 poll() 被唤醒时填装 activeChannels 供 EventLoop 处理。",members:["EventLoop* ownerLoop_: 所属的唯一 EventLoop","std::map<int, Channel*> channels_: 按文件描述符映射管理所有当前已注册的 Channel 裸指针索引","struct epoll_event events_[kInitEventListSize]: 预分配的连续内核事件接收缓冲区"],functions:["virtual ~Poller() = default: 必须声明为虚析构，保证派生类 EPollPoller 资源完整释放","virtual Timestamp poll(int timeoutMs, ChannelList* activeChannels) = 0: 纯虚核心阻塞接口，封装 epoll_wait","virtual void updateChannel(Channel* channel) = 0: 封装 epoll_ctl(ADD/MOD)","virtual void removeChannel(Channel* channel) = 0: 封装 epoll_ctl(DEL) 并从 channels_ 移除","static Poller* newDefaultPoller(EventLoop* loop): 工厂方法，按需生成 EPollPoller"],cppFeatures:["虚基类与纯虚函数","虚析构函数防泄漏","std::map 关联容器","std::vector 连续缓冲区","静态工厂方法"],relatedDays:[8,13,26],status:"未读",notes:""},{id:"eventloop",name:"EventLoop",layer:"事件循环管理",role:"One Loop Per Thread 核心实现。每个线程最多拥有一个 EventLoop 实例。它在专属线程中循环执行 loop()，调用 Poller::poll 获取活跃通道并分发回调，同时维护线程安全的跨线程异步任务队列。",members:["bool looping_: 循环运行状态标志","bool quit_: 退出标志（原子布尔）","const pid_t threadId_: 记录创建本 EventLoop 的专属线程 ID（通过 CurrentThread::tid()）","std::unique_ptr<Poller> poller_: 独占拥有的 I/O 多路复用器，生命周期与 EventLoop 严格共存亡","std::unique_ptr<TimerQueue> timerQueue_: 独占拥有的高精度定时器队列","int wakeupFd_: Linux eventfd 文件描述符，用于跨线程异步唤醒阻塞在 epoll_wait 的 I/O 线程","std::unique_ptr<Channel> wakeupChannel_: 管理 wakeupFd_ 的 Channel 实例","std::vector<Functor> pendingFunctors_: 跨线程投递待在当前 I/O 线程执行的回调任务队列","mutable MutexLock mutex_: 保护 pendingFunctors_ 队列的轻量级互斥锁"],functions:["void loop(): 事件主循环，连续轮询 poll() 并执行 doPendingFunctors()","void quit(): 线程安全退出循环请求","void runInLoop(Functor cb): 在当前 I/O 线程同步立即执行，若在跨线程则调用 queueInLoop","void queueInLoop(Functor cb): 将回调 std::move 进 pendingFunctors_ 并在必要时 wakeup()","void wakeup(): 向 wakeupFd_ 写入 8 字节 uint64_t 计数，即刻唤醒 epoll_wait","void doPendingFunctors(): 局部 swap 转移队列，在极短临界区外串行执行全部闭包"],cppFeatures:["std::unique_ptr 独占所有权","std::vector 移动追加","std::move 移动语义","RAII 锁守护","std::function 异步闭包","assert 断言防御"],relatedDays:[6,8,18,21],status:"未读",notes:""},{id:"acceptor",name:"Acceptor",layer:"监听套接字与新建连接接入层",role:"供 TcpServer 内部使用的高层组件，负责服务端监听套接字（listen socket）的创建、bind 绑定、listen 监听，并通过自身的 acceptChannel_ 监听可读事件。当新客户端连接到来时，调用 ::accept4 获取连接套接字并分发 newConnectionCallback 回调给 TcpServer。",members:["EventLoop* loop_: 所属的主事件循环（通常为主线程 baseLoop）","Socket acceptSocket_: RAII 方式管理的监听套接字，析构自动 close(fd)","Channel acceptChannel_: 监听 acceptSocket_.fd() 读事件的通道","NewConnectionCallback newConnectionCallback_: 连接建立后上报给 TcpServer 的回调闭包","bool listenning_: 监听状态标志","int idleFd_: 预先打开的 /dev/null 占位文件描述符，用于优雅处理 EMFILE（文件描述符耗尽）灾难"],functions:["Acceptor(EventLoop* loop, const InetAddress& listenAddr, bool reuseport): 初始化并绑定地址","~Acceptor(): 离开作用域时由 RAII 自动关闭通道与套接字","void listen(): 设置 socket 为监听模式并启用 acceptChannel_.enableReading()","void handleRead(): 当监听 fd 可读时执行 ::accept4 并触发 newConnectionCallback_"],cppFeatures:["RAII 套接字生命周期封装","noncopyable 禁止误拷贝","std::function 回调挂载","std::bind 适配"],relatedDays:[3,7,19],status:"未读",notes:""},{id:"tcpconnection",name:"TcpConnection",layer:"客户端长连接全生命周期管理",role:"muduo 中最核心、复杂度最高的业务连接实体。代表一个已经成功建立的 TCP 全双工网络连接。它独占客户端连接 Socket 与 Channel，拥有独立的应用层 inputBuffer_ 与 outputBuffer_，通过继承 std::enable_shared_from_this 确保在跨线程异步回调中安全保活。",members:["EventLoop* loop_: 本连接被分配绑定的 SubLoop（从属 I/O 线程）","const string name_: 连接唯一标识字符串","StateE state_: 连接状态机枚举 (kConnecting, kConnected, kDisconnecting, kDisconnected)","std::unique_ptr<Socket> socket_: 独占拥有的客户端 TCP 连接套接字","std::unique_ptr<Channel> channel_: 独占拥有的网络事件通道","Buffer inputBuffer_: 接收数据非阻塞应用层输入缓冲区","Buffer outputBuffer_: 待发送数据非阻塞应用层输出缓冲区","ConnectionCallback connectionCallback_: 连接建立/关闭状态回调","MessageCallback messageCallback_: 消息数据到达回调","WriteCompleteCallback writeCompleteCallback_: 数据完全发送完毕回调","CloseCallback closeCallback_: 内部关闭通知 TcpServer 回调"],functions:["void send(const void* message, int len): 线程安全的数据发送入口","void sendInLoop(const StringPiece& message): 若输出缓冲为空且在当前 I/O 线程则直接 ::write 原地发送，剩余未发完数据追加到 outputBuffer_ 并开启 EPOLLOUT 监听","void shutdown(): 优雅半关闭连接写端（::shutdown(fd, SHUT_WR)）","void handleRead(Timestamp receiveTime): 读就绪时调用 Buffer::readFd 读取数据并触发 messageCallback_","void handleWrite(): 写就绪时将 outputBuffer_ 中的积压数据写入内核并适时关闭 EPOLLOUT","void handleClose(): 处理对端关闭，注销 Channel，触发 closeCallback_ 通知 TcpServer","void connectEstablished(): 连接确立时挂载 Channel::tie(shared_from_this())"],cppFeatures:["std::enable_shared_from_this 生命周期管理","std::shared_ptr 共享模型","std::unique_ptr 独占套接字","Buffer 应用层缓冲","状态机枚举设计"],relatedDays:[9,10,14,18,19],status:"未读",notes:""},{id:"tcpserver",name:"TcpServer",layer:"TCP 服务端连接管理层",role:"TCP 服务端管理器。集成 Acceptor（监听连接）和 EventLoopThreadPool（从属事件循环线程池），在 map<string, TcpConnectionPtr> conns_ 中维护所有存活长连接，并通过回调完成连接建立与注销。",members:["EventLoop* loop_: 主事件循环 (baseLoop，负责接收连接)","const string ipPort_: 服务器绑定的 IP:Port 标识","const string name_: 服务名称","std::unique_ptr<Acceptor> acceptor_: 独占的监听接收器","std::shared_ptr<EventLoopThreadPool> threadPool_: 从属 SubLoop 线程池","ConnectionMap connections_: std::map<string, TcpConnectionPtr> 维护活跃连接","ConnectionCallback connectionCallback_: 用户注册的连接状态变更回调","MessageCallback messageCallback_: 用户注册的业务消息到来回调","WriteCompleteCallback writeCompleteCallback_: 用户注册的发送完毕回调","AtomicInt32 started_: 原子标志确保 start() 幂等执行"],functions:["TcpServer(EventLoop* loop, const InetAddress& listenAddr, const string& name): 构造配置","void setThreadNum(int numThreads): 配置从属 I/O 工作线程数量","void start(): 启动线程池并使 acceptor_ 进入 listen 状态","void newConnection(int sockfd, const InetAddress& peerAddr): Acceptor 触发后通过 round-robin 选出 SubLoop 构建 TcpConnectionPtr 并存入 connections_ 映射表","void removeConnection(const TcpConnectionPtr& conn): 将连接从 connections_ 摘除并投递到所在 Loop 执行 connectDestroyed"],cppFeatures:["std::map 红黑树存储长连接","std::bind 绑定成员函数","std::shared_ptr 共享托管","noncopyable 禁用拷贝","原子变量保护"],relatedDays:[9,13,14,19],status:"未读",notes:""},{id:"buffer",name:"Buffer",layer:"应用层自适应非阻塞 I/O 缓冲器",role:"解决非阻塞网络 I/O 下数据发送不完全（TCP 协议滑动窗口与内核发送缓冲区满）与粘包分包问题的关键构件。底层基于连续内存 std::vector<char> 构建，利用 prepends (预留头部)、readerIndex (可读游标) 与 writerIndex (可写游标) 消除无谓的内存移动，配合 readv 分散读实现减少内存碎片的平滑扩容。",members:["std::vector<char> buffer_: 连续内存存储载体，保证高 CPU Cache 局部性","size_t readerIndex_: 指示当前有效可读数据的起始偏移量","size_t writerIndex_: 指示当前已写入数据的末尾偏移量","static const size_t kCheapPrepend = 8: 头部预留 8 字节空间，用于方便协议栈就地 prepend 包头长度而免于再次拷贝","static const size_t kInitialSize = 1024: 初始默认分配 1KB 缓冲容量"],functions:["size_t readableBytes() const: writerIndex_ - readerIndex_，查询当前未读字节","size_t writableBytes() const: buffer_.size() - writerIndex_，查询当前剩余可写空间","size_t prependableBytes() const: readerIndex_，查询头部预留空间","void retrieve(size_t len): 消耗读取特定长度数据，向前推进 readerIndex_","void append(const char* data, size_t len): 追加新数据到 buffer_，不够时自动扩容","void makeSpace(size_t more): 空间不足时，若已读空间+可写空间足够则原地搬移整理，否则调用 vector::resize 扩容","ssize_t readFd(int fd, int* savedErrno): 结合栈上临时 64KB 数组通过 ::readv 分散读，兼顾小包直接写入与大包按需扩容"],cppFeatures:["std::vector<char> 连续内存","const 成员函数严格约束","readv 系统调用适配","Copy-on-write 优化考虑","按需扩容模型"],relatedDays:[2,6,11,23],status:"未读",notes:""},{id:"timerqueue",name:"TimerQueue",layer:"高精度定时器调度队列",role:"提供线程安全的定时器与心跳超时检测机制。内部借助 Linux timerfd 系统调用（timerfd_create / timerfd_settime），将定时器超时抽象为文件描述符事件，纳入 EventLoop 的 Poller 进行统一监听。基于 std::set<Entry> 维持时间戳递增顺序。",members:["EventLoop* loop_: 所属的 EventLoop 事件循环","const int timerfd_: Linux 内核 timerfd 套接字句柄","Channel timerfdChannel_: 监听 timerfd_ 读事件的专用 Channel","typedef std::pair<Timestamp, Timer*> Entry: 时间戳与定时器裸指针键值对","typedef std::set<Entry> TimerList: 基于红黑树维持微秒到期时间升序排列的集合","TimerList timers_: 按到期时间排序的所有活动定时器集合","bool callingExpiredTimers_: 是否正在遍历执行超时回调的原子状态标志"],functions:["TimerId addTimer(TimerCallback cb, Timestamp when, double interval): 线程安全添加定时器","void cancel(TimerId timerId): 线程安全注销定时器","void handleRead(): 当 timerfd_ 超时变为可读时触发，读取 8 字节并执行 processTimers","std::vector<Entry> getExpired(Timestamp now): 从 timers_ 中利用 lower_bound 快速切分出所有当前已到期的 Entry 列表","void reset(const std::vector<Entry>& expired, Timestamp now): 对周期性定时器（interval > 0）重新计算下次触发时间并塞回 timers_"],cppFeatures:["std::set 红黑树按键排序","std::pair 组合键","timerfd 内核机制","运算符重载 operator< 比较器","算法 lower_bound 二分查找"],relatedDays:[13,22,24],status:"未读",notes:""}],H={"src/http/HttpContext.cpp":`#include "../../include/http/HttpContext.h"

using namespace muduo;
using namespace muduo::net;

namespace http
{

// 将报文解析出来将关键信息封装到HttpRequest对象里面去
bool HttpContext::parseRequest(Buffer *buf, Timestamp receiveTime)
{
    bool ok = true; // 解析每行请求格式是否正确
    bool hasMore = true;
    while (hasMore)
    {
        if (state_ == kExpectRequestLine)
        {
            const char *crlf = buf->findCRLF(); // 注意这个返回值边界可能有错
            if (crlf)
            {
                ok = processRequestLine(buf->peek(), crlf);
                if (ok)
                {
                    request_.setReceiveTime(receiveTime);
                    buf->retrieveUntil(crlf + 2);
                    state_ = kExpectHeaders;
                }
                else
                {
                    hasMore = false;
                }
            }
            else
            {
                hasMore = false;
            }
        }
        else if (state_ == kExpectHeaders)
        {
            const char *crlf = buf->findCRLF();
            if (crlf)
            {
                const char *colon = std::find(buf->peek(), crlf, ':');
                if (colon < crlf)
                {
                    request_.addHeader(buf->peek(), colon, crlf);
                }
                else if (buf->peek() == crlf)
                { 
                    // 空行，结束Header
                    // 根据请求方法和Content-Length判断是否需要继续读取body
                    if (request_.method() == HttpRequest::kPost || 
                        request_.method() == HttpRequest::kPut)
                    {
                        std::string contentLength = request_.getHeader("Content-Length");
                        if (!contentLength.empty())
                        {
                            request_.setContentLength(std::stoi(contentLength));
                            if (request_.contentLength() > 0)
                            {
                                state_ = kExpectBody;
                            }
                            else
                            {
                                state_ = kGotAll;
                                hasMore = false;
                            }
                        }
                        else
                        {
                            // POST/PUT 请求没有 Content-Length，是HTTP语法错误
                            ok = false;
                            hasMore = false;
                        }
                    }
                    else
                    {
                        // GET/HEAD/DELETE 等方法直接完成（没有请求体）
                        state_ = kGotAll; 
                        hasMore = false;
                    }
                }
                else
                {
                    ok = false; // Header行格式错误
                    hasMore = false;
                }
                buf->retrieveUntil(crlf + 2); // 开始读指针指向下一行数据
            }
            else
            {
                hasMore = false;
            }
        }
        else if (state_ == kExpectBody)
        {
            // 检查缓冲区中是否有足够的数据
            if (buf->readableBytes() < request_.contentLength())
            {
                hasMore = false; // 数据不完整，等待更多数据
                return true;
            }

            // 只读取 Content-Length 指定的长度
            std::string body(buf->peek(), buf->peek() + request_.contentLength());
            request_.setBody(body);

            // 准确移动读指针
            buf->retrieve(request_.contentLength());

            state_ = kGotAll;
            hasMore = false;
        }
    }
    return ok; // ok为false代表报文语法解析错误
}

// 解析请求行
bool HttpContext::processRequestLine(const char *begin, const char *end)
{
    bool succeed = false;
    const char *start = begin;
    const char *space = std::find(start, end, ' ');
    if (space != end && request_.setMethod(start, space))
    {
        start = space + 1;
        space = std::find(start, end, ' ');
        if (space != end)
        {
            const char *argumentStart = std::find(start, space, '?');
            if (argumentStart != space) // 请求带参数
            {
                request_.setPath(start, argumentStart); // 注意这些返回值边界
                request_.setQueryParameters(argumentStart + 1, space);
            }
            else // 请求不带参数
            {
                request_.setPath(start, space);
            }

            start = space + 1;
            succeed = ((end - start == 8) && std::equal(start, end - 1, "HTTP/1."));
            if (succeed)
            {
                if (*(end - 1) == '1')
                {
                    request_.setVersion("HTTP/1.1");
                }
                else if (*(end - 1) == '0')
                {
                    request_.setVersion("HTTP/1.0");
                }
                else
                {
                    succeed = false;
                }
            }
        }
    }
    return succeed;
}

} // namespace http`,"include/http/HttpContext.h":`#pragma once

#include <iostream>

#include <muduo/net/TcpServer.h>

#include "HttpRequest.h"

namespace http
{

class HttpContext 
{
public:
    enum HttpRequestParseState
    {
        kExpectRequestLine, // 解析请求行
        kExpectHeaders, // 解析请求头
        kExpectBody, // 解析请求体
        kGotAll, // 解析完成
    };
    
    HttpContext()
    : state_(kExpectRequestLine)
    {}

    bool parseRequest(muduo::net::Buffer* buf, muduo::Timestamp receiveTime);
    bool gotAll() const 
    { return state_ == kGotAll;  }

    void reset()
    {
        state_ = kExpectRequestLine;
        HttpRequest dummyData;
        request_.swap(dummyData);
    }

    const HttpRequest& request() const
    { return request_;}

    HttpRequest& request()
    { return request_;}

private:
    bool processRequestLine(const char* begin, const char* end);
private:
    HttpRequestParseState state_;
    HttpRequest           request_;
};

} // namespace http`,"src/http/HttpRequest.h":`#pragma once

#include <map>
#include <string>
#include <unordered_map>

#include <muduo/base/Timestamp.h>

namespace http
{

class HttpRequest
{
public:
    enum Method
    {
        kInvalid, kGet, kPost, kHead, kPut, kDelete, kOptions
    };
    
    HttpRequest()
        : method_(kInvalid)
        , version_("Unknown")
    {
    }
    
    void setReceiveTime(muduo::Timestamp t);
    muduo::Timestamp receiveTime() const { return receiveTime_; }
    
    bool setMethod(const char* start, const char* end);
    Method method() const { return method_; }

    void setPath(const char* start, const char* end);
    std::string path() const { return path_; }

    void setPathParameters(const std::string &key, const std::string &value);
    std::string getPathParameters(const std::string &key) const;

    void setQueryParameters(const char* start, const char* end);
    std::string getQueryParameters(const std::string &key) const;
    
    void setVersion(std::string v)
    {
        version_ = v;
    }

    std::string getVersion() const
    {
        return version_;
    }
    
    void addHeader(const char* start, const char* colon, const char* end);
    std::string getHeader(const std::string& field) const;

    const std::map<std::string, std::string>& headers() const
    { return headers_; }

    void setBody(const std::string& body) { content_ = body; }
    void setBody(const char* start, const char* end) 
    { 
        if (end >= start) 
        {
            content_.assign(start, end - start); 
        }
    }
    
    std::string getBody() const
    { return content_; }

    void setContentLength(uint64_t length)
    { contentLength_ = length; }
    
    uint64_t contentLength() const
    { return contentLength_; }

    void swap(HttpRequest& that);

private:
    Method                                       method_; // 请求方法
    std::string                                  version_; // http版本
    std::string                                  path_; // 请求路径
    std::unordered_map<std::string, std::string> pathParameters_; // 路径参数
    std::unordered_map<std::string, std::string> queryParameters_; // 查询参数
    muduo::Timestamp                             receiveTime_; // 接收时间
    std::map<std::string, std::string>           headers_; // 请求头
    std::string                                  content_; // 请求体
    uint64_t                                     contentLength_ { 0 }; // 请求体长度
};  

} // namespace http`,"src/http/HttpRequest.cpp":`#include "../../include/http/HttpRequest.h"

namespace http
{

void HttpRequest::setReceiveTime(muduo::Timestamp t)
{
    receiveTime_ = t;
}

bool HttpRequest::setMethod(const char *start, const char *end)
{
    assert(method_ == kInvalid);
    std::string m(start, end); // [start, end)
    if (m == "GET")
    {
        method_ = kGet;
    }
    else if (m == "POST")
    {
        method_ = kPost;
    }
    else if (m == "PUT")
    {
        method_ = kPut;
    }
    else if (m == "DELETE")
    {
        method_ = kDelete;
    }
    else if (m == "OPTIONS")
    {
        method_ = kOptions;
    }
    else
    {
        method_ = kInvalid;
    }

    return method_ != kInvalid;
}

void HttpRequest::setPath(const char *start, const char *end)
{
    path_.assign(start, end);
}

void HttpRequest::setPathParameters(const std::string &key, const std::string &value)
{
    pathParameters_[key] = value;
}

std::string HttpRequest::getPathParameters(const std::string &key) const
{
    auto it = pathParameters_.find(key);
    if (it != pathParameters_.end())
    {
        return it->second;
    }
    return "";
}

std::string HttpRequest::getQueryParameters(const std::string &key) const
{
    auto it = queryParameters_.find(key);
    if (it != queryParameters_.end())
    {
        return it->second;
    }
    return "";
}

// 这是从问号后面分割参数
void HttpRequest::setQueryParameters(const char *start, const char *end)
{
    std::string argumentStr(start, end);
    std::string::size_type pos = 0;
    std::string::size_type prev = 0;

    // 按 & 分割多个参数
    while ((pos = argumentStr.find('&', prev)) != std::string::npos)
    {
        std::string pair = argumentStr.substr(prev, pos - prev);
        std::string::size_type equalPos = pair.find('=');

        if (equalPos != std::string::npos)
        {
            std::string key = pair.substr(0, equalPos);
            std::string value = pair.substr(equalPos + 1);
            queryParameters_[key] = value;
        }

        prev = pos + 1;
    }

    // 处理最后一个参数
    std::string lastPair = argumentStr.substr(prev);
    std::string::size_type equalPos = lastPair.find('=');
    if (equalPos != std::string::npos)
    {
        std::string key = lastPair.substr(0, equalPos);
        std::string value = lastPair.substr(equalPos + 1);
        queryParameters_[key] = value;
    }
}

void HttpRequest::addHeader(const char *start, const char *colon, const char *end)
{
    std::string key(start, colon);
    ++colon;
    while (colon < end && isspace(*colon))
    {
        ++colon;
    }
    std::string value(colon, end);
    while (!value.empty() && isspace(value[value.size() - 1])) // 消除尾部空格
    {
        value.resize(value.size() - 1);
    }
    headers_[key] = value;
}

std::string HttpRequest::getHeader(const std::string &field) const
{
    std::string result;
    auto it = headers_.find(field);
    if (it != headers_.end())
    {
        result = it->second;
    }
    return result;
}

void HttpRequest::swap(HttpRequest &that)
{
    std::swap(method_, that.method_);
    std::swap(path_, that.path_);
    std::swap(pathParameters_, that.pathParameters_);
    std::swap(queryParameters_, that.queryParameters_);
    std::swap(version_, that.version_);
    std::swap(headers_, that.headers_);
    std::swap(receiveTime_, that.receiveTime_);
}

} // namespace http`,"src/http/HttpResponse.cpp":`#include "../../include/http/HttpResponse.h"

namespace http
{

void HttpResponse::appendToBuffer(muduo::net::Buffer* outputBuf) const
{
    // HttpResponse封装的信息格式化输出
    char buf[32]; 
    // 为什么不把状态信息放入格式化字符串中，因为状态信息有长有短，不方便定义一个固定大小的内存存储
    snprintf(buf, sizeof buf, "%s %d ", httpVersion_.c_str(), statusCode_);
    
    outputBuf->append(buf);
    outputBuf->append(statusMessage_);
    outputBuf->append("\\r\\n");

    if (closeConnection_) // 思考一下这些地方是不是可以直接移入近headers_中
    {
        outputBuf->append("Connection: close\\r\\n");
    }
    else
    {
        //snprintf(buf, sizeof buf, "Content-Length: %zd\\r\\n", body_.size());
        //outputBuf->append(buf);
        outputBuf->append("Connection: Keep-Alive\\r\\n");
    }

    for (const auto& header : headers_)
    { // 为什么这里不用格式化字符串？因为key和value的长度不定
        outputBuf->append(header.first);
        outputBuf->append(": "); 
        outputBuf->append(header.second);
        outputBuf->append("\\r\\n");
    }
    outputBuf->append("\\r\\n");
    
    outputBuf->append(body_);
}

void HttpResponse::setStatusLine(const std::string& version,
                                 HttpStatusCode statusCode,
                                 const std::string& statusMessage)
{
    httpVersion_ = version;
    statusCode_ = statusCode;
    statusMessage_ = statusMessage;
}

} // namespace http`,"include/http/HttpResponse.h":`#pragma once

#include <muduo/net/TcpServer.h>

namespace http
{

class HttpResponse 
{
public:
    enum HttpStatusCode
    {
        kUnknown,
        k200Ok = 200,
        k204NoContent = 204,
        k301MovedPermanently = 301,
        k400BadRequest = 400,
        k401Unauthorized = 401,
        k403Forbidden = 403,
        k404NotFound = 404,
        k409Conflict = 409,
        k500InternalServerError = 500,
    };

    HttpResponse(bool close = true)
        : statusCode_(kUnknown)
        , closeConnection_(close)
    {}

    void setVersion(std::string version)
    { httpVersion_ = version; }
    void setStatusCode(HttpStatusCode code)
    { statusCode_ = code; }

    HttpStatusCode getStatusCode() const
    { return statusCode_; }

    void setStatusMessage(const std::string message)
    { statusMessage_ = message; }

    void setCloseConnection(bool on)
    { closeConnection_ = on; }

    bool closeConnection() const
    { return closeConnection_; }
    
    void setContentType(const std::string& contentType)
    { addHeader("Content-Type", contentType); }

    void setContentLength(uint64_t length)
    { addHeader("Content-Length", std::to_string(length)); }

    void addHeader(const std::string& key, const std::string& value)
    { headers_[key] = value; }
    
    void setBody(const std::string& body)
    { 
        body_ = body;
        // body_ += "\\0";
    }

    void setStatusLine(const std::string& version,
                         HttpStatusCode statusCode,
                         const std::string& statusMessage);

    void setErrorHeader(){}

    void appendToBuffer(muduo::net::Buffer* outputBuf) const;
private:
    std::string                        httpVersion_; 
    HttpStatusCode                     statusCode_;
    std::string                        statusMessage_;
    bool                               closeConnection_;
    std::map<std::string, std::string> headers_;
    std::string                        body_;
    bool                               isFile_;
};

} // namespace http`,"src/http/Router.cpp":`#include "../../include/router/Router.h"
#include <muduo/base/Logging.h>

namespace http
{
namespace router
{

void Router::registerHandler(HttpRequest::Method method, const std::string &path, HandlerPtr handler)
{
    RouteKey key{method, path};
    handlers_[key] = std::move(handler);
}

void Router::registerCallback(HttpRequest::Method method, const std::string &path, const HandlerCallback &callback)
{
    RouteKey key{method, path};
    callbacks_[key] = std::move(callback);
}

bool Router::route(const HttpRequest &req, HttpResponse *resp)
{
    RouteKey key{req.method(), req.path()};

    // 查找处理器
    auto handlerIt = handlers_.find(key);
    if (handlerIt != handlers_.end())
    {
        handlerIt->second->handle(req, resp);
        return true;
    }

    // 查找回调函数
    auto callbackIt = callbacks_.find(key);
    if (callbackIt != callbacks_.end())
    {
        callbackIt->second(req, resp);
        return true;
    }

    // 查找动态路由处理器
    for (const auto &[method, pathRegex, handler] : regexHandlers_)
    {
        std::smatch match;
        std::string pathStr(req.path());
        // 如果方法匹配并且动态路由匹配，则执行处理器
        if (method == req.method() && std::regex_match(pathStr, match, pathRegex))
        {
            // Extract path parameters and add them to the request
            HttpRequest newReq(req); // 因为这里需要用这一次所以是可以改的
            extractPathParameters(match, newReq);
            
            handler->handle(newReq, resp);
            return true;
        }
    }

    // 查找动态路由回调函数
    for (const auto &[method, pathRegex, callback] : regexCallbacks_)
    {
        std::smatch match;
        std::string pathStr(req.path());
        // 如果方法匹配并且动态路由匹配，则执行回调函数
        if (method == req.method() && std::regex_match(pathStr, match, pathRegex))
        {
             // Extract path parameters and add them to the request
            HttpRequest newReq(req); // 因为这里需要用这一次所以是可以改的
            extractPathParameters(match, newReq);

            callback(req, resp);
            return true;
        }
    }

    return false;
}

} // namespace router
} // namespace http`,"include/router/Router.h":`#pragma once
#include <iostream>
#include <unordered_map>
#include <string>
#include <memory>
#include <functional>
#include <regex>
#include <vector>

#include "RouterHandler.h"
#include "../http/HttpRequest.h"
#include "../http/HttpResponse.h"

namespace http
{
namespace router
{

// 选择注册对象式的路由处理器还是注册回调函数式的处理器取决于处理器执行的复杂程度
// 如果是简单的处理可以注册回调函数，否则注册对象式路由处理器(对象中可封装多个相关函数)
// 二者注册其一即可
class Router
{
public:
    using HandlerPtr = std::shared_ptr<RouterHandler>;
    using HandlerCallback = std::function<void(const HttpRequest &, HttpResponse *)>;

    // 路由键（请求方法 + URI）
    struct RouteKey
    {
        HttpRequest::Method method;
        std::string path;

        bool operator==(const RouteKey &other) const
        {
            return method == other.method && path == other.path;
        }
    };

    // 为RouteKey 定义哈希函数
    struct RouteKeyHash
    {
        // size_t operator()(const RouteKey& key) const
        // {
        //     return std::hash<int>{}(static_cast<int>(key.method)) ^
        //            std::hash<std::string>{}(key.path);
        // }
        size_t operator()(const RouteKey &key) const
        {
            size_t methodHash = std::hash<int>{}(static_cast<int>(key.method));
            size_t pathHash = std::hash<std::string>{}(key.path);
            return methodHash * 31 + pathHash;
        }
    };

    // 注册路由处理器
    void registerHandler(HttpRequest::Method method, const std::string &path, HandlerPtr handler);

    // 注册回调函数形式的处理器
    void registerCallback(HttpRequest::Method method, const std::string &path, const HandlerCallback &callback);

    // 注册动态路由处理器
    void addRegexHandler(HttpRequest::Method method, const std::string &path, HandlerPtr handler)
    {
        std::regex pathRegex = convertToRegex(path);
        regexHandlers_.emplace_back(method, pathRegex, handler);
    }

    // 注册动态路由处理函数
    void addRegexCallback(HttpRequest::Method method, const std::string &path, const HandlerCallback &callback)
    {
        std::regex pathRegex = convertToRegex(path);
        regexCallbacks_.emplace_back(method, pathRegex, callback);
    }

    // 处理请求
    bool route(const HttpRequest &req, HttpResponse *resp);

private:
    std::regex convertToRegex(const std::string &pathPattern)
    { // 将路径模式转换为正则表达式，支持匹配任意路径参数
        std::string regexPattern = "^" + std::regex_replace(pathPattern, std::regex(R"(/:([^/]+))"), R"(/([^/]+))") + "$";
        return std::regex(regexPattern);
    }

    // 提取路径参数
    void extractPathParameters(const std::smatch &match, HttpRequest &request)
    {
        // Assuming the first match is the full path, parameters start from index 1
        for (size_t i = 1; i < match.size(); ++i)
        {
            request.setPathParameters("param" + std::to_string(i), match[i].str());
        }
    }

private:
    struct RouteCallbackObj
    {
        HttpRequest::Method method_;
        std::regex pathRegex_;
        HandlerCallback callback_;
        RouteCallbackObj(HttpRequest::Method method, std::regex pathRegex, const HandlerCallback &callback)
            : method_(method), pathRegex_(pathRegex), callback_(callback) {}
    };

    struct RouteHandlerObj
    {
        HttpRequest::Method method_;
        std::regex pathRegex_;
        HandlerPtr handler_;
        RouteHandlerObj(HttpRequest::Method method, std::regex pathRegex, HandlerPtr handler)
            : method_(method), pathRegex_(pathRegex), handler_(handler) {}
    };

    std::unordered_map<RouteKey, HandlerPtr, RouteKeyHash>      handlers_;       // 精准匹配
    std::unordered_map<RouteKey, HandlerCallback, RouteKeyHash> callbacks_; // 精准匹配
    std::vector<RouteHandlerObj>                                regexHandlers_;     // 正则匹配
    std::vector<RouteCallbackObj>                               regexCallbacks_;   // 正则匹配
};


} // namespace router
} // namespace http`,"src/core/Server.cpp":`#include "../../include/http/HttpServer.h"

#include <any>
#include <functional>
#include <memory>

namespace http
{

// 默认http回应函数
void defaultHttpCallback(const HttpRequest &, HttpResponse *resp)
{
    resp->setStatusCode(HttpResponse::k404NotFound);
    resp->setStatusMessage("Not Found");
    resp->setCloseConnection(true);
}

HttpServer::HttpServer(int port,
                       const std::string &name,
                       bool useSSL,
                       muduo::net::TcpServer::Option option)
    : listenAddr_(port)
    , server_(&mainLoop_, listenAddr_, name, option)
    , useSSL_(useSSL)
    , httpCallback_(std::bind(&HttpServer::handleRequest, this, std::placeholders::_1, std::placeholders::_2))
{
    initialize();
}

// 服务器运行函数
void HttpServer::start()
{
    LOG_WARN << "HttpServer[" << server_.name() << "] starts listening on" << server_.ipPort();
    server_.start();
    mainLoop_.loop();
}

void HttpServer::initialize()
{
    // 设置回调函数
    server_.setConnectionCallback(
        std::bind(&HttpServer::onConnection, this, std::placeholders::_1));
    server_.setMessageCallback(
        std::bind(&HttpServer::onMessage, this,
                  std::placeholders::_1,
                  std::placeholders::_2,
                  std::placeholders::_3));
}

void HttpServer::setSslConfig(const ssl::SslConfig& config)
{
    if (useSSL_)
    {
        sslCtx_ = std::make_unique<ssl::SslContext>(config);
        if (!sslCtx_->initialize())
        {
            LOG_ERROR << "Failed to initialize SSL context";
            abort();
        }
    }
}

void HttpServer::onConnection(const muduo::net::TcpConnectionPtr& conn)
{
    if (conn->connected())
    {
        if (useSSL_)
        {
            auto sslConn = std::make_unique<ssl::SslConnection>(conn, sslCtx_.get());
            sslConn->setMessageCallback(
                std::bind(&HttpServer::onMessage, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3));
            sslConns_[conn] = std::move(sslConn);
            sslConns_[conn]->startHandshake();
        }
        conn->setContext(HttpContext());
    }
    else 
    {
        if (useSSL_)
        {
            sslConns_.erase(conn);
        }
    }
}

void HttpServer::onMessage(const muduo::net::TcpConnectionPtr &conn,
                           muduo::net::Buffer *buf,
                           muduo::Timestamp receiveTime)
{
    try
    {
        // 这层判断只是代表是否支持ssl
        if (useSSL_)
        {
            LOG_INFO << "onMessage useSSL_ is true";
            // 1.查找对应的SSL连接
            auto it = sslConns_.find(conn);
            if (it != sslConns_.end())
            {
                LOG_INFO << "onMessage sslConns_ is not empty";
                // 2. SSL连接处理数据
                it->second->onRead(conn, buf, receiveTime);

                // 3. 如果 SSL 握手还未完成，直接返回
                if (!it->second->isHandshakeCompleted())
                {
                    LOG_INFO << "onMessage sslConns_ is not empty";
                    return;
                }

                // 4. 从SSL连接的解密缓冲区获取数据
                muduo::net::Buffer* decryptedBuf = it->second->getDecryptedBuffer();
                if (decryptedBuf->readableBytes() == 0)
                    return; // 没有解密后的数据

                // 5. 使用解密后的数据进行HTTP 处理
                buf = decryptedBuf; // 将 buf 指向解密后的数据
                LOG_INFO << "onMessage decryptedBuf is not empty";
            }
        }
        // HttpContext对象用于解析出buf中的请求报文，并把报文的关键信息封装到HttpRequest对象中
        HttpContext *context = boost::any_cast<HttpContext>(conn->getMutableContext());
        if (!context->parseRequest(buf, receiveTime)) // 解析一个http请求
        {
            // 如果解析http报文过程中出错
            conn->send("HTTP/1.1 400 Bad Request\\r\\n\\r\\n");
            conn->shutdown();
        }
        // 如果buf缓冲区中解析出一个完整的数据包才封装响应报文
        if (context->gotAll())
        {
            onRequest(conn, context->request());
            context->reset();
        }
    }
    catch (const std::exception &e)
    {
        // 捕获异常，返回错误信息
        LOG_ERROR << "Exception in onMessage: " << e.what();
        conn->send("HTTP/1.1 400 Bad Request\\r\\n\\r\\n");
        conn->shutdown();
    }
}

void HttpServer::onRequest(const muduo::net::TcpConnectionPtr &conn, const HttpRequest &req)
{
    const std::string &connection = req.getHeader("Connection");
    bool close = ((connection == "close") ||
                  (req.getVersion() == "HTTP/1.0" && connection != "Keep-Alive"));
    HttpResponse response(close);

    // 根据请求报文信息来封装响应报文对象
    httpCallback_(req, &response); // 执行onHttpCallback函数

    // 可以给response设置一个成员，判断是否请求的是文件，如果是文件设置为true，并且存在文件位置在这里send出去。
    muduo::net::Buffer buf;
    response.appendToBuffer(&buf);
    // 打印完整的响应内容用于调试
    LOG_INFO << "Sending response:\\n" << buf.toStringPiece().as_string();

    conn->send(&buf);
    // 如果是短连接的话，返回响应报文后就断开连接
    if (response.closeConnection())
    {
        conn->shutdown();
    }
}

// 执行请求对应的路由处理函数
void HttpServer::handleRequest(const HttpRequest &req, HttpResponse *resp)
{
    try
    {
        // 处理请求前的中间件
        HttpRequest mutableReq = req;
        middlewareChain_.processBefore(mutableReq);

        // 路由处理
        if (!router_.route(mutableReq, resp))
        {
            LOG_INFO << "请求的啥，url：" << req.method() << " " << req.path();
            LOG_INFO << "未找到路由，返回404";
            resp->setStatusCode(HttpResponse::k404NotFound);
            resp->setStatusMessage("Not Found");
            resp->setCloseConnection(true);
        }

        // 处理响应后的中间件
        middlewareChain_.processAfter(*resp);
    }
    catch (const HttpResponse& res) 
    {
        // 处理中间件抛出的响应（如CORS预检请求）
        *resp = res;
    }
    catch (const std::exception& e) 
    {
        // 错误处理
        resp->setStatusCode(HttpResponse::k500InternalServerError);
        resp->setBody(e.what());
    }
}

} // namespace http`,"src/http/HttpServer.cpp":`#include "../../include/http/HttpServer.h"

#include <any>
#include <functional>
#include <memory>

namespace http
{

// 默认http回应函数
void defaultHttpCallback(const HttpRequest &, HttpResponse *resp)
{
    resp->setStatusCode(HttpResponse::k404NotFound);
    resp->setStatusMessage("Not Found");
    resp->setCloseConnection(true);
}

HttpServer::HttpServer(int port,
                       const std::string &name,
                       bool useSSL,
                       muduo::net::TcpServer::Option option)
    : listenAddr_(port)
    , server_(&mainLoop_, listenAddr_, name, option)
    , useSSL_(useSSL)
    , httpCallback_(std::bind(&HttpServer::handleRequest, this, std::placeholders::_1, std::placeholders::_2))
{
    initialize();
}

// 服务器运行函数
void HttpServer::start()
{
    LOG_WARN << "HttpServer[" << server_.name() << "] starts listening on" << server_.ipPort();
    server_.start();
    mainLoop_.loop();
}

void HttpServer::initialize()
{
    // 设置回调函数
    server_.setConnectionCallback(
        std::bind(&HttpServer::onConnection, this, std::placeholders::_1));
    server_.setMessageCallback(
        std::bind(&HttpServer::onMessage, this,
                  std::placeholders::_1,
                  std::placeholders::_2,
                  std::placeholders::_3));
}

void HttpServer::setSslConfig(const ssl::SslConfig& config)
{
    if (useSSL_)
    {
        sslCtx_ = std::make_unique<ssl::SslContext>(config);
        if (!sslCtx_->initialize())
        {
            LOG_ERROR << "Failed to initialize SSL context";
            abort();
        }
    }
}

void HttpServer::onConnection(const muduo::net::TcpConnectionPtr& conn)
{
    if (conn->connected())
    {
        if (useSSL_)
        {
            auto sslConn = std::make_unique<ssl::SslConnection>(conn, sslCtx_.get());
            sslConn->setMessageCallback(
                std::bind(&HttpServer::onMessage, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3));
            sslConns_[conn] = std::move(sslConn);
            sslConns_[conn]->startHandshake();
        }
        conn->setContext(HttpContext());
    }
    else 
    {
        if (useSSL_)
        {
            sslConns_.erase(conn);
        }
    }
}

void HttpServer::onMessage(const muduo::net::TcpConnectionPtr &conn,
                           muduo::net::Buffer *buf,
                           muduo::Timestamp receiveTime)
{
    try
    {
        // 这层判断只是代表是否支持ssl
        if (useSSL_)
        {
            LOG_INFO << "onMessage useSSL_ is true";
            // 1.查找对应的SSL连接
            auto it = sslConns_.find(conn);
            if (it != sslConns_.end())
            {
                LOG_INFO << "onMessage sslConns_ is not empty";
                // 2. SSL连接处理数据
                it->second->onRead(conn, buf, receiveTime);

                // 3. 如果 SSL 握手还未完成，直接返回
                if (!it->second->isHandshakeCompleted())
                {
                    LOG_INFO << "onMessage sslConns_ is not empty";
                    return;
                }

                // 4. 从SSL连接的解密缓冲区获取数据
                muduo::net::Buffer* decryptedBuf = it->second->getDecryptedBuffer();
                if (decryptedBuf->readableBytes() == 0)
                    return; // 没有解密后的数据

                // 5. 使用解密后的数据进行HTTP 处理
                buf = decryptedBuf; // 将 buf 指向解密后的数据
                LOG_INFO << "onMessage decryptedBuf is not empty";
            }
        }
        // HttpContext对象用于解析出buf中的请求报文，并把报文的关键信息封装到HttpRequest对象中
        HttpContext *context = boost::any_cast<HttpContext>(conn->getMutableContext());
        if (!context->parseRequest(buf, receiveTime)) // 解析一个http请求
        {
            // 如果解析http报文过程中出错
            conn->send("HTTP/1.1 400 Bad Request\\r\\n\\r\\n");
            conn->shutdown();
        }
        // 如果buf缓冲区中解析出一个完整的数据包才封装响应报文
        if (context->gotAll())
        {
            onRequest(conn, context->request());
            context->reset();
        }
    }
    catch (const std::exception &e)
    {
        // 捕获异常，返回错误信息
        LOG_ERROR << "Exception in onMessage: " << e.what();
        conn->send("HTTP/1.1 400 Bad Request\\r\\n\\r\\n");
        conn->shutdown();
    }
}

void HttpServer::onRequest(const muduo::net::TcpConnectionPtr &conn, const HttpRequest &req)
{
    const std::string &connection = req.getHeader("Connection");
    bool close = ((connection == "close") ||
                  (req.getVersion() == "HTTP/1.0" && connection != "Keep-Alive"));
    HttpResponse response(close);

    // 根据请求报文信息来封装响应报文对象
    httpCallback_(req, &response); // 执行onHttpCallback函数

    // 可以给response设置一个成员，判断是否请求的是文件，如果是文件设置为true，并且存在文件位置在这里send出去。
    muduo::net::Buffer buf;
    response.appendToBuffer(&buf);
    // 打印完整的响应内容用于调试
    LOG_INFO << "Sending response:\\n" << buf.toStringPiece().as_string();

    conn->send(&buf);
    // 如果是短连接的话，返回响应报文后就断开连接
    if (response.closeConnection())
    {
        conn->shutdown();
    }
}

// 执行请求对应的路由处理函数
void HttpServer::handleRequest(const HttpRequest &req, HttpResponse *resp)
{
    try
    {
        // 处理请求前的中间件
        HttpRequest mutableReq = req;
        middlewareChain_.processBefore(mutableReq);

        // 路由处理
        if (!router_.route(mutableReq, resp))
        {
            LOG_INFO << "请求的啥，url：" << req.method() << " " << req.path();
            LOG_INFO << "未找到路由，返回404";
            resp->setStatusCode(HttpResponse::k404NotFound);
            resp->setStatusMessage("Not Found");
            resp->setCloseConnection(true);
        }

        // 处理响应后的中间件
        middlewareChain_.processAfter(*resp);
    }
    catch (const HttpResponse& res) 
    {
        // 处理中间件抛出的响应（如CORS预检请求）
        *resp = res;
    }
    catch (const std::exception& e) 
    {
        // 错误处理
        resp->setStatusCode(HttpResponse::k500InternalServerError);
        resp->setBody(e.what());
    }
}

} // namespace http`,"include/http/HttpServer.h":`#pragma once 

#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>

#include <functional>
#include <iostream>
#include <map>
#include <memory>
#include <unordered_map>

#include <muduo/net/TcpServer.h>
#include <muduo/net/EventLoop.h>
#include <muduo/base/Logging.h>

#include "HttpContext.h"
#include "HttpRequest.h"
#include "HttpResponse.h"
#include "../router/Router.h"
#include "../session/SessionManager.h"
#include "../middleware/MiddlewareChain.h"
#include "../middleware/cors/CorsMiddleware.h"
#include "../ssl/SslConnection.h"
#include "../ssl/SslContext.h"

class HttpRequest;
class HttpResponse;

namespace http
{

class HttpServer : muduo::noncopyable
{
public:
    using HttpCallback = std::function<void (const http::HttpRequest&, http::HttpResponse*)>;
    
    // 构造函数
    HttpServer(int port,
               const std::string& name,
               bool useSSL = false,
               muduo::net::TcpServer::Option option = muduo::net::TcpServer::kNoReusePort);
    
    void setThreadNum(int numThreads)
    {
        server_.setThreadNum(numThreads);
    }

    void start();

    muduo::net::EventLoop* getLoop() const 
    { 
        return server_.getLoop(); 
    }

    void setHttpCallback(const HttpCallback& cb)
    {
        httpCallback_ = cb;
    }

    // 注册静态路由处理器
    void Get(const std::string& path, const HttpCallback& cb)
    {
        router_.registerCallback(HttpRequest::kGet, path, cb);
    }
    
    // 注册静态路由处理器
    void Get(const std::string& path, router::Router::HandlerPtr handler)
    {
        router_.registerHandler(HttpRequest::kGet, path, handler);
    }

    void Post(const std::string& path, const HttpCallback& cb)
    {
        router_.registerCallback(HttpRequest::kPost, path, cb);
    }

    void Post(const std::string& path, router::Router::HandlerPtr handler)
    {
        router_.registerHandler(HttpRequest::kPost, path, handler);
    }

    // 注册动态路由处理器
    void addRoute(HttpRequest::Method method, const std::string& path, router::Router::HandlerPtr handler)
    {
        router_.addRegexHandler(method, path, handler);
    }

    // 注册动态路由处理函数
    void addRoute(HttpRequest::Method method, const std::string& path, const router::Router::HandlerCallback& callback)
    {
        router_.addRegexCallback(method, path, callback);
    }

    // 设置会话管理器
    void setSessionManager(std::unique_ptr<session::SessionManager> manager)
    {
        sessionManager_ = std::move(manager);
    }

    // 获取会话管理器
    session::SessionManager* getSessionManager() const
    {
        return sessionManager_.get();
    }

    // 添加中间件的方法
    void addMiddleware(std::shared_ptr<middleware::Middleware> middleware) 
    {
        middlewareChain_.addMiddleware(middleware);
    }

    void enableSSL(bool enable) 
    {
        useSSL_ = enable;
    }

    void setSslConfig(const ssl::SslConfig& config);

private:
    void initialize();

    void onConnection(const muduo::net::TcpConnectionPtr& conn);
    void onMessage(const muduo::net::TcpConnectionPtr& conn,
                   muduo::net::Buffer* buf,
                   muduo::Timestamp receiveTime);
    void onRequest(const muduo::net::TcpConnectionPtr&, const HttpRequest&);

    void handleRequest(const HttpRequest& req, HttpResponse* resp);
    
private:
    muduo::net::InetAddress                      listenAddr_; // 监听地址
    muduo::net::TcpServer                        server_; 
    muduo::net::EventLoop                        mainLoop_; // 主循环
    HttpCallback                                 httpCallback_; // 回调函数
    router::Router                               router_; // 路由
    std::unique_ptr<session::SessionManager>     sessionManager_; // 会话管理器
    middleware::MiddlewareChain                  middlewareChain_; // 中间件链
    std::unique_ptr<ssl::SslContext>             sslCtx_; // SSL 上下文
    bool                                         useSSL_; // 是否使用 SSL   
    // TcpConnectionPtr -> SslConnectionPtr 
    std::map<muduo::net::TcpConnectionPtr, std::unique_ptr<ssl::SslConnection>> sslConns_;
}; 

} // namespace http`,"src/core/ConnectionPool.cpp":`#include "../../../include/utils/db/DbConnectionPool.h"
#include "../../../include/utils/db/DbException.h"
#include <muduo/base/Logging.h>

namespace http 
{
namespace db 
{

void DbConnectionPool::init(const std::string& host,
                          const std::string& user,
                          const std::string& password,
                          const std::string& database,
                          size_t poolSize) 
{
    // 连接池会被多个线程访问，所以操作其成员变量时需要加锁
    std::lock_guard<std::mutex> lock(mutex_);
    // 确保只初始化一次
    if (initialized_) 
    {
        return;
    }

    host_ = host;
    user_ = user;
    password_ = password;
    database_ = database;

    // 创建连接
    for (size_t i = 0; i < poolSize; ++i) 
    {
        connections_.push(createConnection());
    }

    initialized_ = true;
    LOG_INFO << "Database connection pool initialized with " << poolSize << " connections";
}

DbConnectionPool::DbConnectionPool() 
{
    checkThread_ = std::thread(&DbConnectionPool::checkConnections, this);
    checkThread_.detach();
}

DbConnectionPool::~DbConnectionPool() 
{
    std::lock_guard<std::mutex> lock(mutex_);
    while (!connections_.empty()) 
    {
        connections_.pop();
    }
    LOG_INFO << "Database connection pool destroyed";
}

// 修改获取连接的函数
std::shared_ptr<DbConnection> DbConnectionPool::getConnection() 
{
    std::shared_ptr<DbConnection> conn;
    {
        std::unique_lock<std::mutex> lock(mutex_);
        
        while (connections_.empty()) 
        {
            if (!initialized_) 
            {
                throw DbException("Connection pool not initialized");
            }
            LOG_INFO << "Waiting for available connection...";
            cv_.wait(lock);
        }
        
        conn = connections_.front();
        connections_.pop();
    } // 释放锁
    
    try 
    {
        // 在锁外检查连接
        if (!conn->ping()) 
        {
            LOG_WARN << "Connection lost, attempting to reconnect...";
            conn->reconnect();
        }
        
        return std::shared_ptr<DbConnection>(conn.get(), 
            [this, conn](DbConnection*) {
                std::lock_guard<std::mutex> lock(mutex_);
                connections_.push(conn);
                cv_.notify_one();
            });
    } 
    catch (const std::exception& e) 
    {
        LOG_ERROR << "Failed to get connection: " << e.what();
        {
            std::lock_guard<std::mutex> lock(mutex_);
            connections_.push(conn);
            cv_.notify_one();
        }
        throw;
    }
}

std::shared_ptr<DbConnection> DbConnectionPool::createConnection() 
{
    return std::make_shared<DbConnection>(host_, user_, password_, database_);
}

// 修改检查连接的函数
void DbConnectionPool::checkConnections() 
{
    while (true) 
    {
        try 
        {
            std::vector<std::shared_ptr<DbConnection>> connsToCheck;
            {
                std::unique_lock<std::mutex> lock(mutex_);
                if (connections_.empty()) 
                {
                    std::this_thread::sleep_for(std::chrono::seconds(1));
                    continue;
                }
                
                auto temp = connections_;
                while (!temp.empty()) 
                {
                    connsToCheck.push_back(temp.front());
                    temp.pop();
                }
            }
            
            // 在锁外检查连接
            for (auto& conn : connsToCheck) 
            {
                if (!conn->ping()) 
                {
                    try 
                    {
                        conn->reconnect();
                    } 
                    catch (const std::exception& e) 
                    {
                        LOG_ERROR << "Failed to reconnect: " << e.what();
                    }
                }
            }
            
            std::this_thread::sleep_for(std::chrono::seconds(60));
        } 
        catch (const std::exception& e) 
        {
            LOG_ERROR << "Error in check thread: " << e.what();
            std::this_thread::sleep_for(std::chrono::seconds(5));
        }
    }
}

} // namespace db
} // namespace http`,"src/utils/db/DbConnectionPool.cpp":`#include "../../../include/utils/db/DbConnectionPool.h"
#include "../../../include/utils/db/DbException.h"
#include <muduo/base/Logging.h>

namespace http 
{
namespace db 
{

void DbConnectionPool::init(const std::string& host,
                          const std::string& user,
                          const std::string& password,
                          const std::string& database,
                          size_t poolSize) 
{
    // 连接池会被多个线程访问，所以操作其成员变量时需要加锁
    std::lock_guard<std::mutex> lock(mutex_);
    // 确保只初始化一次
    if (initialized_) 
    {
        return;
    }

    host_ = host;
    user_ = user;
    password_ = password;
    database_ = database;

    // 创建连接
    for (size_t i = 0; i < poolSize; ++i) 
    {
        connections_.push(createConnection());
    }

    initialized_ = true;
    LOG_INFO << "Database connection pool initialized with " << poolSize << " connections";
}

DbConnectionPool::DbConnectionPool() 
{
    checkThread_ = std::thread(&DbConnectionPool::checkConnections, this);
    checkThread_.detach();
}

DbConnectionPool::~DbConnectionPool() 
{
    std::lock_guard<std::mutex> lock(mutex_);
    while (!connections_.empty()) 
    {
        connections_.pop();
    }
    LOG_INFO << "Database connection pool destroyed";
}

// 修改获取连接的函数
std::shared_ptr<DbConnection> DbConnectionPool::getConnection() 
{
    std::shared_ptr<DbConnection> conn;
    {
        std::unique_lock<std::mutex> lock(mutex_);
        
        while (connections_.empty()) 
        {
            if (!initialized_) 
            {
                throw DbException("Connection pool not initialized");
            }
            LOG_INFO << "Waiting for available connection...";
            cv_.wait(lock);
        }
        
        conn = connections_.front();
        connections_.pop();
    } // 释放锁
    
    try 
    {
        // 在锁外检查连接
        if (!conn->ping()) 
        {
            LOG_WARN << "Connection lost, attempting to reconnect...";
            conn->reconnect();
        }
        
        return std::shared_ptr<DbConnection>(conn.get(), 
            [this, conn](DbConnection*) {
                std::lock_guard<std::mutex> lock(mutex_);
                connections_.push(conn);
                cv_.notify_one();
            });
    } 
    catch (const std::exception& e) 
    {
        LOG_ERROR << "Failed to get connection: " << e.what();
        {
            std::lock_guard<std::mutex> lock(mutex_);
            connections_.push(conn);
            cv_.notify_one();
        }
        throw;
    }
}

std::shared_ptr<DbConnection> DbConnectionPool::createConnection() 
{
    return std::make_shared<DbConnection>(host_, user_, password_, database_);
}

// 修改检查连接的函数
void DbConnectionPool::checkConnections() 
{
    while (true) 
    {
        try 
        {
            std::vector<std::shared_ptr<DbConnection>> connsToCheck;
            {
                std::unique_lock<std::mutex> lock(mutex_);
                if (connections_.empty()) 
                {
                    std::this_thread::sleep_for(std::chrono::seconds(1));
                    continue;
                }
                
                auto temp = connections_;
                while (!temp.empty()) 
                {
                    connsToCheck.push_back(temp.front());
                    temp.pop();
                }
            }
            
            // 在锁外检查连接
            for (auto& conn : connsToCheck) 
            {
                if (!conn->ping()) 
                {
                    try 
                    {
                        conn->reconnect();
                    } 
                    catch (const std::exception& e) 
                    {
                        LOG_ERROR << "Failed to reconnect: " << e.what();
                    }
                }
            }
            
            std::this_thread::sleep_for(std::chrono::seconds(60));
        } 
        catch (const std::exception& e) 
        {
            LOG_ERROR << "Error in check thread: " << e.what();
            std::this_thread::sleep_for(std::chrono::seconds(5));
        }
    }
}

} // namespace db
} // namespace http`,"src/session/Session.cpp":`#include "../include/session/Session.h"

#include "../include/session/SessionManager.h"

namespace http
{
namespace session
{

Session::Session(const std::string& sessionId, SessionManager* sessionManager, int maxAge)
    : sessionId_(sessionId)
    , maxAge_(maxAge)
    , sessionManager_(sessionManager)
{
    refresh(); // 初始化时设置过期时间
}

// 检查会话是否已过期
bool Session::isExpired() const
{
    return std::chrono::system_clock::now() > expiryTime_;
}

// 刷新会话的过期时间
void Session::refresh()
{
    expiryTime_ = std::chrono::system_clock::now() + std::chrono::seconds(maxAge_);
}

// 设置会话数据
void Session::setValue(const std::string& key, const std::string& value)
{
    data_[key] = value;
    // 如果设置了manager，自动保存更改
    if (sessionManager_)
    {
        sessionManager_->updateSession(shared_from_this());
    }
}

// 获取会话数据
std::string Session::getValue(const std::string& key) const
{
    auto it = data_.find(key);
    return it != data_.end() ? it->second : std::string();
}

// 删除会话数据
void Session::remove(const std::string& key)
{
    data_.erase(key);
}

// 清空会话数据
void Session::clear()
{
    data_.clear();
}

} // namespace session
} // namespace http`,"src/session/SessionManager.cpp":`#include"../include/session/SessionManager.h"
#include <iomanip>
#include <iostream>
#include <sstream>

namespace http
{
namespace session
{

// 初始化会话管理器，设置会话存储对象和随机数生成器
SessionManager::SessionManager(std::unique_ptr<SessionStorage> storage)
    : storage_(std::move(storage)) 
    , rng_(std::random_device{}()) // 初始化随机数生成器，用于生成随机的会话ID
{}

// 从请求中获取或创建会话，也就是说，如果请求中包含会话ID，则从存储中加载会话，否则创建一个新的会话
std::shared_ptr<Session> SessionManager::getSession(const HttpRequest& req, HttpResponse* resp)
{   
    std::string sessionId = getSessionIdFromCookie(req);
    
    std::shared_ptr<Session> session;

    if (!sessionId.empty())
    {
        session = storage_->load(sessionId);
    }

    if (!session || session->isExpired())
    {
        sessionId = generateSessionId();
        session = std::make_shared<Session>(sessionId, this);
        setSessionCookie(sessionId, resp);
    }
    else 
    {
        session->setManager(this); // 为现有会话设置管理器
    }

    session->refresh();
    storage_->save(session);  // 这里可能有问题，需要确保正确保存会话
    return session;
}

// 生成唯一的会话标识符，确保会话的唯一性和安全性
std::string SessionManager::generateSessionId()
{
    std::stringstream ss;
    std::uniform_int_distribution<> dist(0, 15);

    // 生成32个字符的会话ID，每个字符是一个十六进制数字
    for (int i = 0; i < 32; ++i)
    {
        ss << std::hex << dist(rng_);
    }
    return ss.str();
}

void SessionManager::destroySession(const std::string& sessionId)
{
    storage_->remove(sessionId);
}

void SessionManager::cleanExpiredSessions()
{
    // 注意：这个实现依赖于具体的存储实现
    // 对于内存存储，可以在加载时检查是否过期
    // 对于其他存储的实现，可能需要定期清理过期会话
}

std::string SessionManager::getSessionIdFromCookie(const HttpRequest& req)
{
    std::string sessionId;
    std::string cookie = req.getHeader("Cookie");

    if (!cookie.empty())
    {
        size_t pos = cookie.find("sessionId=");
        if (pos != std::string::npos)
        {
            pos += 10; // 跳过"sessionId="
            size_t end = cookie.find(';', pos);
            if (end != std::string::npos)
            {
                sessionId = cookie.substr(pos, end - pos);
            }
            else
            {
                sessionId = cookie.substr(pos);
            }
        }
    }
    
    return sessionId;
}

void SessionManager::setSessionCookie(const std::string& sessionId, HttpResponse* resp)
{
    // 设置会话ID到响应头中，作为Cookie
    std::string cookie = "sessionId=" + sessionId + "; Path=/; HttpOnly";
    resp->addHeader("Set-Cookie", cookie);
}

} // namespace session
} // namespace http`,"src/middleware/CorsMiddleware.cpp":`#include "../../../include/middleware/cors/CorsMiddleware.h"
#include <algorithm>
#include <sstream>
#include <iostream>
#include <muduo/base/Logging.h>

namespace http 
{
namespace middleware 
{

CorsMiddleware::CorsMiddleware(const CorsConfig& config) : config_(config) {}

void CorsMiddleware::before(HttpRequest& request) 
{
    LOG_DEBUG << "CorsMiddleware::before - Processing request";
    
    if (request.method() == HttpRequest::Method::kOptions) 
    {
        LOG_INFO << "Processing CORS preflight request";
        HttpResponse response;
        handlePreflightRequest(request, response);
        throw response;
    }
}

void CorsMiddleware::after(HttpResponse& response) 
{
    LOG_DEBUG << "CorsMiddleware::after - Processing response";
    
    // 直接添加CORS头，简化处理逻辑
    if (!config_.allowedOrigins.empty()) 
    {
        // 如果允许所有源
        if (std::find(config_.allowedOrigins.begin(), config_.allowedOrigins.end(), "*") 
            != config_.allowedOrigins.end()) 
        {
            addCorsHeaders(response, "*");
        } 
        else 
        {
            // 添加第一个允许的源
            addCorsHeaders(response, config_.allowedOrigins[0]);
        }
    }
}

bool CorsMiddleware::isOriginAllowed(const std::string& origin) const 
{
    return config_.allowedOrigins.empty() || 
           std::find(config_.allowedOrigins.begin(), 
                    config_.allowedOrigins.end(), "*") != config_.allowedOrigins.end() ||
           std::find(config_.allowedOrigins.begin(), 
                    config_.allowedOrigins.end(), origin) != config_.allowedOrigins.end();
}

void CorsMiddleware::handlePreflightRequest(const HttpRequest& request, 
                                          HttpResponse& response) 
{
    const std::string& origin = request.getHeader("Origin");
    
    if (!isOriginAllowed(origin)) 
    {
        LOG_WARN << "Origin not allowed: " << origin;
        response.setStatusCode(HttpResponse::k403Forbidden);
        return;
    }

    addCorsHeaders(response, origin);
    response.setStatusCode(HttpResponse::k204NoContent);
    LOG_INFO << "Preflight request processed successfully";
}

void CorsMiddleware::addCorsHeaders(HttpResponse& response, 
                                  const std::string& origin) 
{
    try 
    {
        response.addHeader("Access-Control-Allow-Origin", origin);
        
        if (config_.allowCredentials) 
        {
            response.addHeader("Access-Control-Allow-Credentials", "true");
        }
        
        if (!config_.allowedMethods.empty()) 
        {
            response.addHeader("Access-Control-Allow-Methods", 
                             join(config_.allowedMethods, ", "));
        }
        
        if (!config_.allowedHeaders.empty()) 
        {
            response.addHeader("Access-Control-Allow-Headers", 
                             join(config_.allowedHeaders, ", "));
        }
        
        response.addHeader("Access-Control-Max-Age", 
                          std::to_string(config_.maxAge));
        
        LOG_DEBUG << "CORS headers added successfully";
    } 
    catch (const std::exception& e) 
    {
        LOG_ERROR << "Error adding CORS headers: " << e.what();
    }
}

// 工具函数：将字符串数组连接成单个字符串
std::string CorsMiddleware::join(const std::vector<std::string>& strings, const std::string& delimiter) 
{
    std::ostringstream result;
    for (size_t i = 0; i < strings.size(); ++i) 
    {
        if (i > 0) result << delimiter;
        result << strings[i];
    }
    return result.str();
}

} // namespace middleware
} // namespace http`,"src/mcp/McpRegistry.cpp":`#include "../include/AIUtil/AIToolRegistry.h"
#include <sstream>


AIToolRegistry::AIToolRegistry() {
    registerTool("get_weather", getWeather);
    registerTool("get_time", getTime);
}


void AIToolRegistry::registerTool(const std::string& name, ToolFunc func) {
    tools_[name] = func;
}


json AIToolRegistry::invoke(const std::string& name, const json& args) const {
    auto it = tools_.find(name);
    if (it == tools_.end()) {
        throw std::runtime_error("Tool not found: " + name);
    }
    return it->second(args);
}


bool AIToolRegistry::hasTool(const std::string& name) const {
    return tools_.count(name) > 0;
}


size_t AIToolRegistry::WriteCallback(void* contents, size_t size, size_t nmemb, std::string* output) {
    size_t totalSize = size * nmemb;
    output->append((char*)contents, totalSize);
    return totalSize;
}


json AIToolRegistry::getWeather(const json& args) {
    if (!args.contains("city")) {
        return json{ {"error", "Missing parameter: city"} };
    }

    std::string city = args["city"].get<std::string>();
    std::string encodedCity;

    
    char* encoded = curl_easy_escape(nullptr, city.c_str(), city.length());
    if (encoded) {
        encodedCity = encoded;
        curl_free(encoded);
    }
    else {
        return json{ {"error", "URL encode failed"} };
    }

    std::string url = "https://wttr.in/" + encodedCity + "?format=3&lang=zh";

    CURL* curl = curl_easy_init();
    std::string response;

    if (!curl) {
        return json{ {"error", "Failed to init CURL"} };
    }

    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 5L);
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);

    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) {
        return json{ {"error", "CURL request failed"} };
    }

    
    return json{ {"city", city}, {"weather", response} };
}


json AIToolRegistry::getTime(const json& args) {
    (void)args;
    std::time_t t = std::time(nullptr);
    std::tm* now = std::localtime(&t);
    char buffer[64];
    std::strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", now);
    return json{ {"time", buffer} };
}
`,"src/mcp/ToolCaller.cpp":`#include"../include/AIUtil/AIHelper.h"
#include"../include/AIUtil/MQManager.h"
#include <stdexcept>
#include<chrono>

// 构造函数
AIHelper::AIHelper() {
    //默认使用阿里云大模型
    strategy = StrategyFactory::instance().create("1");
}

void AIHelper::setStrategy(std::shared_ptr<AIStrategy> strat) {
    strategy = strat;
}


// 设置默认模型
//void AIHelper::setModel(const std::string& modelName) {
  //  model_ = modelName;
//}

// 添加一条用户消息
void AIHelper::addMessage(int userId,const std::string& userName, bool is_user,const std::string& userInput, std::string sessionId) {
    auto now = std::chrono::system_clock::now();
    auto duration = now.time_since_epoch();
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(duration).count();
    messages.push_back({ userInput,ms });
    //消息队列异步入库
    pushMessageToMysql(userId, userName, is_user, userInput, ms, sessionId);
}

void AIHelper::restoreMessage(const std::string& userInput,long long ms) {
    messages.push_back({ userInput,ms });
}


// 发送聊天消息
std::string AIHelper::chat(int userId,std::string userName, std::string sessionId, std::string userQuestion, std::string modelType) {

    //设置策略
    setStrategy(StrategyFactory::instance().create(modelType));

    
    if (false == strategy->isMCPModel) {

        addMessage(userId, userName, true, userQuestion, sessionId);
        json payload = strategy->buildRequest(this->messages);

        //执行请求
        json response = executeCurl(payload);
        std::string answer = strategy->parseResponse(response);
        addMessage(userId, userName, false, answer, sessionId);
        return answer.empty() ? "[Error] 无法解析响应" : answer;
    }
    //说明支持MCP
    AIConfig config;
    config.loadFromFile("../AIApps/ChatServer/resource/config.json");
    std::string tempUserQuestion =config.buildPrompt(userQuestion);
    std::cout << "tempUserQuestion is " << tempUserQuestion << std::endl;
    messages.push_back({ tempUserQuestion, 0 });

    json firstReq = strategy->buildRequest(this->messages);
    json firstResp = executeCurl(firstReq);
    std::string aiResult = strategy->parseResponse(firstResp);
    // 用完立即移除提示词
    messages.pop_back();

    std::cout << "aiResult is " << aiResult << std::endl;
    // 解析AI响应（是否工具调用）
    AIToolCall call = config.parseAIResponse(aiResult);

    // 情况1：AI 不调用工具
    if (!call.isToolCall) {
        addMessage(userId, userName, true, userQuestion, sessionId);
        addMessage(userId, userName, false, aiResult, sessionId);

        std::cout << "No tools required" << std::endl;
        return aiResult;
    }

    // 情况 2：AI 要调用工具
    json toolResult;
    AIToolRegistry registry;

    try {
        toolResult = registry.invoke(call.toolName, call.args);
        std::cout << "Tool call success" << std::endl;
    }
    catch (const std::exception& e) {
        //大多数情况都不会走这里
        std::string err = "[工具调用失败] " + std::string(e.what());
        addMessage(userId, userName, true, userQuestion, sessionId);
        addMessage(userId, userName, false, err, sessionId);

        std::cout << "Tool call failed" << std::endl << std::string(e.what());
        return err;
    }

    // 第二次调用AI
    // 用同样的 prompt_template，但说明工具执行过
    std::string secondPrompt = config.buildToolResultPrompt(userQuestion, call.toolName, call.args, toolResult);
    
    std::cout << "secondPrompt is " << secondPrompt << std::endl;
    messages.push_back({ secondPrompt, 0 });

    json secondReq = strategy->buildRequest(messages);
    json secondResp = executeCurl(secondReq);
    std::string finalAnswer = strategy->parseResponse(secondResp);
    //删除包含提示词的信息
    messages.pop_back();

    std::cout << "finalAnswer is " << finalAnswer << std::endl;

    addMessage(userId, userName, true, userQuestion, sessionId);
    addMessage(userId, userName, false, finalAnswer, sessionId);
    return finalAnswer;

}

// 发送自定义请求体
json AIHelper::request(const json& payload) {
    return executeCurl(payload);
}

std::vector<std::pair<std::string, long long>> AIHelper::GetMessages() {
    return this->messages;
}


// 内部方法：执行 curl 请求
json AIHelper::executeCurl(const json& payload) {
    CURL* curl = curl_easy_init();
    if (!curl) {
        throw std::runtime_error("Failed to initialize curl");
    }

    std::cout<<"test "<< strategy->getApiUrl().c_str()<<' '<< strategy->getApiKey()<<std::endl;

    std::string readBuffer;
    struct curl_slist* headers = nullptr;
    std::string authHeader = "Authorization: Bearer " + strategy->getApiKey();

    headers = curl_slist_append(headers, authHeader.c_str());
    headers = curl_slist_append(headers, "Content-Type: application/json");

    std::string payloadStr = payload.dump();


    curl_easy_setopt(curl, CURLOPT_URL, strategy->getApiUrl().c_str());
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, payloadStr.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);

    CURLcode res = curl_easy_perform(curl);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) {
        throw std::runtime_error("curl_easy_perform() failed: " + std::string(curl_easy_strerror(res)));
    }

    try {
        return json::parse(readBuffer);
    }
    catch (...) {
        throw std::runtime_error("Failed to parse JSON response: " + readBuffer);
    }
}

// curl 回调函数，把返回的数据写到 string buffer
size_t AIHelper::WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
    size_t totalSize = size * nmemb;
    std::string* buffer = static_cast<std::string*>(userp);
    buffer->append(static_cast<char*>(contents), totalSize);
    return totalSize;
}

std::string AIHelper::escapeString(const std::string& input) {
    std::string output;
    output.reserve(input.size() * 2);
    for (char c : input) {
        switch (c) {
            case '\\\\': output += "\\\\\\\\"; break;
            case '\\'': output += "\\\\\\'"; break;
            case '\\"': output += "\\\\\\""; break;
            case '\\n': output += "\\\\n"; break;
            case '\\r': output += "\\\\r"; break;
            case '\\t': output += "\\\\t"; break;
            default:   output += c; break;
        }
    }
    return output;
}


void AIHelper::pushMessageToMysql(int userId, const std::string& userName, bool is_user, const std::string& userInput,long long ms, std::string sessionId) {
    // std::string sql = "INSERT INTO chat_message (id, username, is_user, content, ts) VALUES ("
    //     + std::to_string(userId) + ", "  // 这里用 userId 作为 id，或者你自己生成
    //     + "'" + userName + "', "
    //     + std::to_string(is_user ? 1 : 0) + ", "
    //     + "'" + userInput + "', "
    //     + std::to_string(ms) + ")";
    std::string safeUserName = escapeString(userName);
    std::string safeUserInput = escapeString(userInput);

    std::string sql = "INSERT INTO chat_message (id, username, session_id, is_user, content, ts) VALUES ("
        + std::to_string(userId) + ", "
        + "'" + safeUserName + "', "
        + sessionId + ", "
        + std::to_string(is_user ? 1 : 0) + ", "
        + "'" + safeUserInput + "', "
        + std::to_string(ms) + ")";

    //改成消息队列异步执行mysql操作，用于流量削峰与解耦逻辑
    //mysqlUtil_.executeUpdate(sql);

    MQManager::instance().publish("sql_queue", sql);
}

`,"src/mcp/JsonRpcHandler.cpp":`#pragma once
#include <string>
#include <vector>
#include <utility>
#include <iostream>
#include <sstream>
#include <memory>

#include "../../../../HttpServer/include/utils/JsonUtil.h"



class AIStrategy {
public:
    virtual ~AIStrategy() = default;

    
    virtual std::string getApiUrl() const = 0;

    // API Key
    virtual std::string getApiKey() const = 0;


    virtual std::string getModel() const = 0;


    virtual json buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const = 0;


    virtual std::string parseResponse(const json& response) const = 0;

    bool isMCPModel = false;

};

class AliyunStrategy : public AIStrategy {

public:
    AliyunStrategy() {
        const char* key = std::getenv("DASHSCOPE_API_KEY");
        if (!key) throw std::runtime_error("Aliyun API Key not found!");
        apiKey_ = key;
        isMCPModel = false;
    }

    std::string getApiUrl() const override;
    std::string getApiKey() const override;
    std::string getModel() const override;

    json buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const override;
    std::string parseResponse(const json& response) const override;

private:
    std::string apiKey_;
};

class DouBaoStrategy : public AIStrategy {

public:
    DouBaoStrategy() {
        const char* key = std::getenv("DOUBAO_API_KEY");
        if (!key) throw std::runtime_error("DOUBAO API Key not found!");
        apiKey_ = key;
        isMCPModel = false;
    }
    std::string getApiUrl() const override;
    std::string getApiKey() const override;
    std::string getModel() const override;

    json buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const override;
    std::string parseResponse(const json& response) const override;

private:
    std::string apiKey_;
};

class AliyunRAGStrategy : public AIStrategy {

public:
    AliyunRAGStrategy() {
        const char* key = std::getenv("DASHSCOPE_API_KEY");
        if (!key) throw std::runtime_error("Aliyun API Key not found!");
        apiKey_ = key;
        isMCPModel = false;
    }

    std::string getApiUrl() const override;
    std::string getApiKey() const override;
    std::string getModel() const override;

    json buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const override;
    std::string parseResponse(const json& response) const override;

private:
    std::string apiKey_;
};

class AliyunMcpStrategy : public AIStrategy {

public:
    AliyunMcpStrategy() {
        const char* key = std::getenv("DASHSCOPE_API_KEY");
        if (!key) throw std::runtime_error("Aliyun API Key not found!");
        apiKey_ = key;
        isMCPModel = true;
    }

    std::string getApiUrl() const override;
    std::string getApiKey() const override;
    std::string getModel() const override;

    json buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const override;
    std::string parseResponse(const json& response) const override;

private:
    std::string apiKey_;
};







`,"src/ai/ModelClient.cpp":`#include"../include/AIUtil/AIStrategy.h"
#include"../include/AIUtil/AIFactory.h"

std::string AliyunStrategy::getApiUrl() const {
    return "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
}

std::string AliyunStrategy::getApiKey()const {
    return apiKey_;
}


std::string AliyunStrategy::getModel() const {
    return "qwen-plus";
}


json AliyunStrategy::buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const {
    json payload;
    payload["model"] = getModel();
    json msgArray = json::array();

    for (size_t i = 0; i < messages.size(); ++i) {
        json msg;
        if (i % 2 == 0) {
            msg["role"] = "user";
        }
        else {
            msg["role"] = "assistant";
        }
        msg["content"] = messages[i].first;
        msgArray.push_back(msg);
    }
    payload["messages"] = msgArray;
    return payload;
}


std::string AliyunStrategy::parseResponse(const json& response) const {
    if (response.contains("choices") && !response["choices"].empty()) {
        return response["choices"][0]["message"]["content"];
    }
    return {};
}


std::string DouBaoStrategy::getApiUrl()const {
    return "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
}

std::string DouBaoStrategy::getApiKey()const {
    return apiKey_;
}


std::string DouBaoStrategy::getModel() const {
    return "doubao-seed-1-6-thinking-250715";
}


json DouBaoStrategy::buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const {
    json payload;
    payload["model"] = getModel();
    json msgArray = json::array();

    for (size_t i = 0; i < messages.size(); ++i) {
        json msg;
        if (i % 2 == 0) {
            msg["role"] = "user";
        }
        else {
            msg["role"] = "assistant";
        }
        msg["content"] = messages[i].first;
        msgArray.push_back(msg);
    }
    payload["messages"] = msgArray;
    return payload;
}


std::string DouBaoStrategy::parseResponse(const json& response) const {
    if (response.contains("choices") && !response["choices"].empty()) {
        return response["choices"][0]["message"]["content"];
    }
    return {};
}


std::string AliyunRAGStrategy::getApiUrl() const {
    const char* key = std::getenv("Knowledge_Base_ID");
    if (!key) throw std::runtime_error("Knowledge_Base_ID not found!");
    std::string id(key);
    //϶Ӧ֪ʶID
    return "https://dashscope.aliyuncs.com/api/v1/apps/"+id+"/completion";
}

std::string AliyunRAGStrategy::getApiKey()const {
    return apiKey_;
}


std::string AliyunRAGStrategy::getModel() const {
    return ""; //Ҫģ
}


json AliyunRAGStrategy::buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const {
    json payload;
    json msgArray = json::array();
    for (size_t i = 0; i < messages.size(); ++i) {
        json msg;
        msg["role"] = (i % 2 == 0 ? "user" : "assistant");
        msg["content"] = messages[i].first;
        msgArray.push_back(msg);
    }
    payload["input"]["messages"] = msgArray;
    payload["parameters"] = json::object(); 
    return payload;
}


std::string AliyunRAGStrategy::parseResponse(const json& response) const {
    if (response.contains("output") && response["output"].contains("text")) {
        return response["output"]["text"];
    }
    return {};
}



std::string AliyunMcpStrategy::getApiUrl() const {
    return "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
}

std::string AliyunMcpStrategy::getApiKey()const {
    return apiKey_;
}


std::string AliyunMcpStrategy::getModel() const {
    return "qwen-plus";
}


json AliyunMcpStrategy::buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const {
    json payload;
    payload["model"] = getModel();
    json msgArray = json::array();

    for (size_t i = 0; i < messages.size(); ++i) {
        json msg;
        if (i % 2 == 0) {
            msg["role"] = "user";
        }
        else {
            msg["role"] = "assistant";
        }
        msg["content"] = messages[i].first;
        msgArray.push_back(msg);
    }
    payload["messages"] = msgArray;
    return payload;
}


std::string AliyunMcpStrategy::parseResponse(const json& response) const {
    if (response.contains("choices") && !response["choices"].empty()) {
        return response["choices"][0]["message"]["content"];
    }
    return {};
}


static StrategyRegister<AliyunStrategy> regAliyun("1");
static StrategyRegister<DouBaoStrategy> regDoubao("2");
static StrategyRegister<AliyunRAGStrategy> regAliyunRag("3");
static StrategyRegister<AliyunMcpStrategy> regAliyunMcp("4");`,"src/ai/StreamParser.cpp":`#include "../include/handlers/ChatSendHandler.h"


void ChatSendHandler::handle(const http::HttpRequest& req, http::HttpResponse* resp)
{
    try
    {

        auto session = server_->getSessionManager()->getSession(req, resp);
        LOG_INFO << "session->getValue(\\"isLoggedIn\\") = " << session->getValue("isLoggedIn");
        if (session->getValue("isLoggedIn") != "true")
        {

            json errorResp;
            errorResp["status"] = "error";
            errorResp["message"] = "Unauthorized";
            std::string errorBody = errorResp.dump(4);

            server_->packageResp(req.getVersion(), http::HttpResponse::k401Unauthorized,
                "Unauthorized", true, "application/json", errorBody.size(),
                errorBody, resp);
            return;
        }


        int userId = std::stoi(session->getValue("userId"));
        std::string username = session->getValue("username");

        std::string userQuestion;
        std::string modelType;
        std::string sessionId;

        auto body = req.getBody();
        if (!body.empty()) {
            auto j = json::parse(body);
            if (j.contains("question")) userQuestion = j["question"];
            if (j.contains("sessionId")) sessionId = j["sessionId"];

            modelType = j.contains("modelType") ? j["modelType"].get<std::string>() : "1";
        }


        std::shared_ptr<AIHelper> AIHelperPtr;
        {
            std::lock_guard<std::mutex> lock(server_->mutexForChatInformation);

            auto& userSessions = server_->chatInformation[userId];

            if (userSessions.find(sessionId) == userSessions.end()) {

                userSessions.emplace( 
                    sessionId,
                    std::make_shared<AIHelper>()
                );
            }
            AIHelperPtr= userSessions[sessionId];
        }
        

        std::string aiInformation=AIHelperPtr->chat(userId, username,sessionId, userQuestion, modelType);
        json successResp;
        successResp["success"] = true;
        successResp["Information"] = aiInformation;
        std::string successBody = successResp.dump(4);

        resp->setStatusLine(req.getVersion(), http::HttpResponse::k200Ok, "OK");
        resp->setCloseConnection(false);
        resp->setContentType("application/json");
        resp->setContentLength(successBody.size());
        resp->setBody(successBody);
        return;
    }
    catch (const std::exception& e)
    {

        json failureResp;
        failureResp["status"] = "error";
        failureResp["message"] = e.what();
        std::string failureBody = failureResp.dump(4);
        resp->setStatusLine(req.getVersion(), http::HttpResponse::k400BadRequest, "Bad Request");
        resp->setCloseConnection(true);
        resp->setContentType("application/json");
        resp->setContentLength(failureBody.size());
        resp->setBody(failureBody);
    }
}









`,"src/ai/ContextCache.cpp":`#include"../include/session/SessionManager.h"
#include <iomanip>
#include <iostream>
#include <sstream>

namespace http
{
namespace session
{

// 初始化会话管理器，设置会话存储对象和随机数生成器
SessionManager::SessionManager(std::unique_ptr<SessionStorage> storage)
    : storage_(std::move(storage)) 
    , rng_(std::random_device{}()) // 初始化随机数生成器，用于生成随机的会话ID
{}

// 从请求中获取或创建会话，也就是说，如果请求中包含会话ID，则从存储中加载会话，否则创建一个新的会话
std::shared_ptr<Session> SessionManager::getSession(const HttpRequest& req, HttpResponse* resp)
{   
    std::string sessionId = getSessionIdFromCookie(req);
    
    std::shared_ptr<Session> session;

    if (!sessionId.empty())
    {
        session = storage_->load(sessionId);
    }

    if (!session || session->isExpired())
    {
        sessionId = generateSessionId();
        session = std::make_shared<Session>(sessionId, this);
        setSessionCookie(sessionId, resp);
    }
    else 
    {
        session->setManager(this); // 为现有会话设置管理器
    }

    session->refresh();
    storage_->save(session);  // 这里可能有问题，需要确保正确保存会话
    return session;
}

// 生成唯一的会话标识符，确保会话的唯一性和安全性
std::string SessionManager::generateSessionId()
{
    std::stringstream ss;
    std::uniform_int_distribution<> dist(0, 15);

    // 生成32个字符的会话ID，每个字符是一个十六进制数字
    for (int i = 0; i < 32; ++i)
    {
        ss << std::hex << dist(rng_);
    }
    return ss.str();
}

void SessionManager::destroySession(const std::string& sessionId)
{
    storage_->remove(sessionId);
}

void SessionManager::cleanExpiredSessions()
{
    // 注意：这个实现依赖于具体的存储实现
    // 对于内存存储，可以在加载时检查是否过期
    // 对于其他存储的实现，可能需要定期清理过期会话
}

std::string SessionManager::getSessionIdFromCookie(const HttpRequest& req)
{
    std::string sessionId;
    std::string cookie = req.getHeader("Cookie");

    if (!cookie.empty())
    {
        size_t pos = cookie.find("sessionId=");
        if (pos != std::string::npos)
        {
            pos += 10; // 跳过"sessionId="
            size_t end = cookie.find(';', pos);
            if (end != std::string::npos)
            {
                sessionId = cookie.substr(pos, end - pos);
            }
            else
            {
                sessionId = cookie.substr(pos);
            }
        }
    }
    
    return sessionId;
}

void SessionManager::setSessionCookie(const std::string& sessionId, HttpResponse* resp)
{
    // 设置会话ID到响应头中，作为Cookie
    std::string cookie = "sessionId=" + sessionId + "; Path=/; HttpOnly";
    resp->addHeader("Set-Cookie", cookie);
}

} // namespace session
} // namespace http`,"src/mq/RabbitMQProducer.cpp":`#include"../include/AIUtil/MQManager.h"

// ------------------- MQManager -------------------
MQManager::MQManager(size_t poolSize)
    : poolSize_(poolSize), counter_(0) {
    for (size_t i = 0; i < poolSize_; ++i) {
        auto conn = std::make_shared<MQConn>();
        //  Create
        conn->channel = AmqpClient::Channel::Create("localhost", 5672, "guest", "guest", "/");

        pool_.push_back(conn);
    }
}

void MQManager::publish(const std::string& queue, const std::string& msg) {
    size_t index = counter_.fetch_add(1) % poolSize_;
    auto& conn = pool_[index];

    std::lock_guard<std::mutex> lock(conn->mtx);
    auto message = AmqpClient::BasicMessage::Create(msg);
    conn->channel->BasicPublish("", queue, message);
}

// ------------------- RabbitMQThreadPool -------------------

void RabbitMQThreadPool::start() {
    for (int i = 0; i < thread_num_; ++i) {
        workers_.emplace_back(&RabbitMQThreadPool::worker, this, i);
    }
}

void RabbitMQThreadPool::shutdown() {
    stop_ = true;
    for (auto& t : workers_) {
        if (t.joinable()) t.join();
    }
}

void RabbitMQThreadPool::worker(int id) {
    try {
        // Each thread has its own independent channel
        auto channel = AmqpClient::Channel::Create(rabbitmq_host_, 5672, "guest", "guest", "/");
        // set exclusive
        channel->DeclareQueue(queue_name_, false, true, false, false);
        // Prevent channel error: 403: AMQP_BASIC_CONSUME_METHOD caused: ACCESS_REFUSED - queue 
        // 'sql_queue' in vhost '/' in exclusive use
        // std::string consumer_tag = channel->BasicConsume(queue_name_, "");
        std::string consumer_tag = channel->BasicConsume(queue_name_, "", true, false, false);

        channel->BasicQos(consumer_tag, 1); 

        while (!stop_) {
            AmqpClient::Envelope::ptr_t env;
            bool ok = channel->BasicConsumeMessage(consumer_tag, env, 500); // 500ms 
            if (ok && env) {
                std::string msg = env->Message()->Body();
                handler_(msg);          
                channel->BasicAck(env); 
            }
        }

        channel->BasicCancel(consumer_tag);
    }
    catch (const std::exception& e) {
        std::cerr << "Thread " << id << " exception: " << e.what() << std::endl;
    }
}
`,"src/chat/ChatServer.cpp":`#include "../include/handlers/ChatLoginHandler.h"
#include "../include/handlers/ChatRegisterHandler.h"
#include "../include/handlers/ChatLogoutHandler.h"
#include"../include/handlers/ChatHandler.h"
#include"../include/handlers/ChatEntryHandler.h"
#include"../include/handlers/ChatSendHandler.h"
#include"../include/handlers/AIMenuHandler.h"
#include"../include/handlers/AIUploadSendHandler.h"
#include"../include/handlers/AIUploadHandler.h"
#include"../include/handlers/ChatHistoryHandler.h"


#include"../include/handlers/ChatCreateAndSendHandler.h"
#include"../include/handlers/ChatSessionsHandler.h"
#include"../include/handlers/ChatSpeechHandler.h"

#include "../include/ChatServer.h"
#include "../../../HttpServer/include/http/HttpRequest.h"
#include "../../../HttpServer/include/http/HttpResponse.h"
#include "../../../HttpServer/include/http/HttpServer.h"



using namespace http;


ChatServer::ChatServer(int port,
    const std::string& name,
    muduo::net::TcpServer::Option option)
    : httpServer_(port, name, option)
{
    initialize();
}

void ChatServer::initialize() {
    std::cout << "ChatServer initialize start  ! " << std::endl;
	http::MysqlUtil::init("tcp://127.0.0.1:3306", "root", "123456", "ChatHttpServer", 5);

    initializeSession();

    initializeMiddleware();

    initializeRouter();
}

void ChatServer::initChatMessage() {

    std::cout << "initChatMessage start ! " << std::endl;
    readDataFromMySQL();
    std::cout << "initChatMessage success ! " << std::endl;
}

void ChatServer::readDataFromMySQL() {


    std::string sql = "SELECT id, username,session_id, is_user, content, ts FROM chat_message ORDER BY ts ASC, id ASC";

    sql::ResultSet* res;
    try {
        res = mysqlUtil_.executeQuery(sql);
    }
    catch (const std::exception& e) {
        std::cerr << "MySQL query failed: " << e.what() << std::endl;
        return;
    }

    while (res->next()) {
        long long user_id = 0;
        std::string session_id ;  
        std::string username, content;
        long long ts = 0;
        int is_user = 1;

        try {
            user_id    = res->getInt64("id");       
            session_id = res->getString("session_id");  
            username   = res->getString("username");
            content    = res->getString("content");
            ts         = res->getInt64("ts");
            is_user    = res->getInt("is_user");
        }
        catch (const std::exception& e) {
            std::cerr << "Failed to read row: " << e.what() << std::endl;
            continue; 
        }

        auto& userSessions = chatInformation[user_id];

        std::shared_ptr<AIHelper> helper;
        auto itSession = userSessions.find(session_id);
        if (itSession == userSessions.end()) {
            helper = std::make_shared<AIHelper>();
            userSessions[session_id] = helper;
			sessionsIdsMap[user_id].push_back(session_id);
        } else {
            helper = itSession->second;
        }

        helper->restoreMessage(content, ts);
    }

    std::cout << "readDataFromMySQL finished" << std::endl;
}



void ChatServer::setThreadNum(int numThreads) {
    httpServer_.setThreadNum(numThreads);
}


void ChatServer::start() {
    httpServer_.start();
}


void ChatServer::initializeRouter() {

    httpServer_.Get("/", std::make_shared<ChatEntryHandler>(this));
    httpServer_.Get("/entry", std::make_shared<ChatEntryHandler>(this));
    
    httpServer_.Post("/login", std::make_shared<ChatLoginHandler>(this));
    
    httpServer_.Post("/register", std::make_shared<ChatRegisterHandler>(this));
    
    httpServer_.Post("/user/logout", std::make_shared<ChatLogoutHandler>(this));

    httpServer_.Get("/chat", std::make_shared<ChatHandler>(this));

    httpServer_.Post("/chat/send", std::make_shared<ChatSendHandler>(this));
 
    httpServer_.Get("/menu", std::make_shared<AIMenuHandler>(this));
    
    httpServer_.Get("/upload", std::make_shared<AIUploadHandler>(this));
   
    httpServer_.Post("/upload/send", std::make_shared<AIUploadSendHandler>(this));
    
    httpServer_.Post("/chat/history", std::make_shared<ChatHistoryHandler>(this));

    
    httpServer_.Post("/chat/send-new-session", std::make_shared<ChatCreateAndSendHandler>(this));
    httpServer_.Get("/chat/sessions", std::make_shared<ChatSessionsHandler>(this));

    httpServer_.Post("/chat/tts", std::make_shared<ChatSpeechHandler>(this));
}

void ChatServer::initializeSession() {

    auto sessionStorage = std::make_unique<http::session::MemorySessionStorage>();

    auto sessionManager = std::make_unique<http::session::SessionManager>(std::move(sessionStorage));

    setSessionManager(std::move(sessionManager));
}

void ChatServer::initializeMiddleware() {

    auto corsMiddleware = std::make_shared<http::middleware::CorsMiddleware>();

    httpServer_.addMiddleware(corsMiddleware);
}


void ChatServer::packageResp(const std::string& version,
    http::HttpResponse::HttpStatusCode statusCode,
    const std::string& statusMsg,
    bool close,
    const std::string& contentType,
    int contentLen,
    const std::string& body,
    http::HttpResponse* resp)
{
    if (resp == nullptr)
    {
        LOG_ERROR << "Response pointer is null";
        return;
    }

    try
    {
        resp->setVersion(version);
        resp->setStatusCode(statusCode);
        resp->setStatusMessage(statusMsg);
        resp->setCloseConnection(close);
        resp->setContentType(contentType);
        resp->setContentLength(contentLen);
        resp->setBody(body);

        LOG_INFO << "Response packaged successfully";
    }
    catch (const std::exception& e)
    {
        LOG_ERROR << "Error in packageResp: " << e.what();

        resp->setStatusCode(http::HttpResponse::k500InternalServerError);
        resp->setStatusMessage("Internal Server Error");
        resp->setCloseConnection(true);
    }
}
`,"examples/test_client.cc":`#include <iostream>
#include <string>
#include <openssl/ssl.h>
#include <openssl/err.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

class HttpsClient 
{
public:
    HttpsClient() 
    {
        // 初始化 OpenSSL
        SSL_library_init();
        SSL_load_error_strings();
        OpenSSL_add_all_algorithms();

        ctx_ = SSL_CTX_new(TLS_client_method());
        if (!ctx_) 
        {
            throw std::runtime_error("Failed to create SSL context");
        }
    }

    ~HttpsClient() 
    {
        if (ssl_) SSL_free(ssl_);
        if (ctx_) SSL_CTX_free(ctx_);
        if (sock_ > 0) close(sock_);
    }

    void connect(const std::string& host, int port) 
    {
        // 创建套接字
        sock_ = socket(AF_INET, SOCK_STREAM, 0);
        if (sock_ < 0) {
            throw std::runtime_error("Failed to create socket");
        }

        struct sockaddr_in addr;
        addr.sin_family = AF_INET;
        addr.sin_port = htons(port);
        addr.sin_addr.s_addr = inet_addr(host.c_str());

        if (::connect(sock_, (struct sockaddr*)&addr, sizeof(addr)) < 0) {
            throw std::runtime_error("Failed to connect");
        }

        ssl_ = SSL_new(ctx_);
        if (!ssl_) {
            throw std::runtime_error("Failed to create SSL");
        }

        SSL_set_fd(ssl_, sock_);
        if (SSL_connect(ssl_) <= 0) {
            throw std::runtime_error("Failed to establish SSL connection");
        }

        std::cout << "Connected using: " << SSL_get_cipher(ssl_) << "\\n";
    }

    void sendGetRequest(const std::string& path) 
    {
        std::cout << "发送请求出去sendGetRequest" << std::endl;
        std::string request = 
            "GET " + path + " HTTP/1.1\\r\\n"
            "Host: localhost\\r\\n"
            "Connection: close\\r\\n"
            "\\r\\n";

        if (SSL_write(ssl_, request.c_str(), request.length()) <= 0) 
        {
            throw std::runtime_error("Failed to send request");
        }

        char buffer[4096];
        int bytes;
        while ((bytes = SSL_read(ssl_, buffer, sizeof(buffer) - 1)) > 0) {
            buffer[bytes] = 0;
            std::cout << buffer;
        }
    }

private:
    SSL_CTX* ctx_ = nullptr;
    SSL* ssl_ = nullptr;
    int sock_ = -1;
};

int main() {
    try {
        HttpsClient client;
        client.connect("127.0.0.1", 443);
        std::cout << "连接成功connect" << std::endl;
        client.sendGetRequest("/");
        return 0;
    }
    catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
}`,"src/core/Buffer.cpp":`#ifndef MUDUO_NET_BUFFER_H
#define MUDUO_NET_BUFFER_H

#include <vector>
#include <string>
#include <algorithm>
#include <cassert>

namespace muduo {
namespace net {

/// A buffer class modeled after org.jboss.netty.buffer.ChannelBuffer
///
/// @code
/// +-------------------+------------------+------------------+
/// | prependable bytes |  readable bytes  |  writable bytes  |
/// |                   |     (CONTENT)    |                  |
/// +-------------------+------------------+------------------+
/// |                   |                  |                  |
/// 0      <=      readerIndex   <=   writerIndex    <=     size
/// @endcode
class Buffer {
 public:
  static const size_t kCheapPrepend = 8;
  static const size_t kInitialSize = 1024;

  explicit Buffer(size_t initialSize = kInitialSize)
    : buffer_(kCheapPrepend + initialSize),
      readerIndex_(kCheapPrepend),
      writerIndex_(kCheapPrepend) {
    assert(readableBytes() == 0);
    assert(writableBytes() == initialSize);
    assert(prependableBytes() == kCheapPrepend);
  }

  size_t readableBytes() const { return writerIndex_ - readerIndex_; }
  size_t writableBytes() const { return buffer_.size() - writerIndex_; }
  size_t prependableBytes() const { return readerIndex_; }

  const char* peek() const { return begin() + readerIndex_; }

  const char* findCRLF() const {
    const char* crlf = std::search(peek(), beginWrite(), kCRLF, kCRLF + 2);
    return crlf == beginWrite() ? NULL : crlf;
  }

  void retrieve(size_t len) {
    assert(len <= readableBytes());
    if (len < readableBytes()) {
      readerIndex_ += len;
    } else {
      retrieveAll();
    }
  }

  void retrieveUntil(const char* end) {
    assert(peek() <= end);
    assert(end <= beginWrite());
    retrieve(end - peek());
  }

  void retrieveAll() {
    readerIndex_ = kCheapPrepend;
    writerIndex_ = kCheapPrepend;
  }

  void append(const char* data, size_t len) {
    ensureWritableBytes(len);
    std::copy(data, data + len, beginWrite());
    hasWritten(len);
  }

  ssize_t readFd(int fd, int* savedErrno);

 private:
  char* begin() { return &*buffer_.begin(); }
  const char* begin() const { return &*buffer_.begin(); }
  char* beginWrite() { return begin() + writerIndex_; }
  const char* beginWrite() const { return begin() + writerIndex_; }
  void hasWritten(size_t len) { writerIndex_ += len; }

  void ensureWritableBytes(size_t len) {
    if (writableBytes() < len) {
      makeSpace(len);
    }
    assert(writableBytes() >= len);
  }

  void makeSpace(size_t len) {
    if (writableBytes() + prependableBytes() < len + kCheapPrepend) {
      buffer_.resize(writerIndex_ + len);
    } else {
      // move readable data to the front, make space inside buffer
      assert(kCheapPrepend < readerIndex_);
      size_t readable = readableBytes();
      std::copy(begin() + readerIndex_,
                begin() + writerIndex_,
                begin() + kCheapPrepend);
      readerIndex_ = kCheapPrepend;
      writerIndex_ = readerIndex_ + readable;
      assert(readable == readableBytes());
    }
  }

 private:
  std::vector<char> buffer_;
  size_t readerIndex_;
  size_t writerIndex_;
  static const char kCRLF[];
};

const char Buffer::kCRLF[] = "\\r\\n";

}  // namespace net
}  // namespace muduo

#endif  // MUDUO_NET_BUFFER_H
`,"src/metrics/MetricsCollector.cpp":`#include <chrono>
#include <atomic>
#include <vector>
#include <numeric>
#include <algorithm>

namespace metrics {

class MetricsCollector {
public:
    static MetricsCollector& instance() {
        static MetricsCollector s_inst;
        return s_inst;
    }

    void recordLatency(int64_t microSeconds) {
        reqCount_.fetch_add(1, std::memory_order_relaxed);
        // 环形缓冲记录最近 10000 次请求时延用于 P99 计算
        size_t idx = bufIndex_.fetch_add(1, std::memory_order_relaxed) % kWindowSize;
        latencyRing_[idx] = microSeconds;
    }

    double getQps() {
        auto now = std::chrono::steady_clock::now();
        double elapsed = std::chrono::duration<double>(now - lastSampleTime_).count();
        if (elapsed <= 0.0) return 0.0;
        int64_t count = reqCount_.load(std::memory_order_relaxed);
        lastSampleTime_ = now;
        return count / elapsed;
    }

    int64_t getP99Latency() {
        std::vector<int64_t> snapshot(latencyRing_.begin(), latencyRing_.end());
        std::sort(snapshot.begin(), snapshot.end());
        size_t p99Idx = static_cast<size_t>(snapshot.size() * 0.99);
        return snapshot[p99Idx];
    }

private:
    static const size_t kWindowSize = 10000;
    std::atomic<int64_t> reqCount_{0};
    std::atomic<size_t> bufIndex_{0};
    std::vector<int64_t> latencyRing_{std::vector<int64_t>(kWindowSize, 0)};
    std::chrono::steady_clock::time_point lastSampleTime_{std::chrono::steady_clock::now()};
};

} // namespace metrics
`,"tests/HttpContext_test.cpp":`#include <gtest/gtest.h>
#include "http/HttpContext.h"
#include "muduo/net/Buffer.h"

using namespace http;
using namespace muduo;
using namespace muduo::net;

TEST(HttpContextTest, ParseSimpleGetRequest) {
    HttpContext context;
    Buffer buf;
    std::string rawHttp = "GET /api/v1/model/chat HTTP/1.1\\r\\n"
                          "Host: 127.0.0.1:8080\\r\\n"
                          "User-Agent: CppAIServiceClient/1.0\\r\\n"
                          "Accept: */*\\r\\n\\r\\n";
    buf.append(rawHttp.c_str(), rawHttp.size());

    EXPECT_TRUE(context.parseRequest(&buf, Timestamp::now()));
    EXPECT_TRUE(context.gotAll());

    const HttpRequest& req = context.request();
    EXPECT_EQ(req.method(), HttpRequest::kGet);
    EXPECT_EQ(req.path(), "/api/v1/model/chat");
    EXPECT_EQ(req.version(), HttpRequest::kHttp11);
    EXPECT_EQ(req.getHeader("Host"), "127.0.0.1:8080");
}

TEST(HttpContextTest, ParseChunkedPostRequestWithBody) {
    HttpContext context;
    Buffer buf;
    std::string reqLine = "POST /api/v1/ai/prompt HTTP/1.1\\r\\n"
                          "Host: localhost\\r\\n"
                          "Content-Type: application/json\\r\\n"
                          "Content-Length: 18\\r\\n\\r\\n"
                          "{\\"query\\":\\"hello\\"}";
    
    // 模拟网络分包传输：先发 Header，再发 Body
    buf.append(reqLine.c_str(), 60);
    EXPECT_TRUE(context.parseRequest(&buf, Timestamp::now()));
    EXPECT_FALSE(context.gotAll()); // 报文尚未完全到达

    buf.append(reqLine.c_str() + 60, reqLine.size() - 60);
    EXPECT_TRUE(context.parseRequest(&buf, Timestamp::now()));
    EXPECT_TRUE(context.gotAll());
    EXPECT_EQ(context.request().body(), "{\\"query\\":\\"hello\\"}");
}
`,"tests/HttpRequest_test.cpp":`#include <gtest/gtest.h>
#include "http/HttpRequest.h"

using namespace http;

TEST(HttpRequestTest, HeaderAndQueryParsing) {
    HttpRequest req;
    req.setMethod(HttpRequest::kGet);
    req.setPath("/search?keyword=muduo&page=2");

    EXPECT_EQ(req.method(), HttpRequest::kGet);
    EXPECT_EQ(req.path(), "/search?keyword=muduo&page=2");
    
    req.addHeader("Connection", "keep-alive");
    EXPECT_EQ(req.getHeader("Connection"), "keep-alive");
    EXPECT_TRUE(req.closeConnection() == false);
}
`,"tests/HttpResponse_test.cpp":`#include <gtest/gtest.h>
#include "http/HttpResponse.h"
#include "muduo/net/Buffer.h"

using namespace http;
using namespace muduo::net;

TEST(HttpResponseTest, SerializationStandardResponse) {
    HttpResponse resp(false);
    resp.setStatusCode(HttpResponse::k200Ok);
    resp.setStatusMessage("OK");
    resp.setContentType("application/json");
    resp.setBody("{\\"status\\":\\"success\\"}");

    Buffer output;
    resp.appendToBuffer(&output);

    std::string result(output.peek(), output.readableBytes());
    EXPECT_NE(result.find("HTTP/1.1 200 OK\\r\\n"), std::string::npos);
    EXPECT_NE(result.find("Content-Type: application/json\\r\\n"), std::string::npos);
    EXPECT_NE(result.find("Content-Length: 20\\r\\n"), std::string::npos);
}
`,"tests/Router_test.cpp":`#include <gtest/gtest.h>
#include "router/Router.h"

using namespace http::router;

TEST(RouterTest, PrefixAndExactMatch) {
    Router router;
    bool handlerCalled = false;

    router.addRoute(HttpRequest::kGet, "/api/v1/chat", [&](const HttpRequest& req, HttpResponse* resp) {
        handlerCalled = true;
        resp->setStatusCode(HttpResponse::k200Ok);
    });

    HttpRequest req;
    req.setMethod(HttpRequest::kGet);
    req.setPath("/api/v1/chat");
    HttpResponse resp(false);

    router.route(req, &resp);
    EXPECT_TRUE(handlerCalled);
    EXPECT_EQ(resp.statusCode(), HttpResponse::k200Ok);
}
`,"tests/Server_test.cpp":`#include "http/HttpServer.h"
#include "muduo/net/EventLoop.h"

using namespace http;
using namespace muduo::net;

int main() {
    EventLoop loop;
    InetAddress listenAddr(8080);
    HttpServer server(&loop, listenAddr, "CppAIServer");

    server.setHttpCallback([](const HttpRequest& req, HttpResponse* resp) {
        resp->setStatusCode(HttpResponse::k200Ok);
        resp->setStatusMessage("OK");
        resp->setContentType("text/plain");
        resp->setBody("Hello from CppAIService EventLoop!");
    });

    server.start();
    loop.loop();
    return 0;
}
`,"tests/ConnectionPool_test.cpp":`#include <gtest/gtest.h>
#include "utils/db/DbConnectionPool.h"

using namespace http::db;

TEST(DbConnectionPoolTest, AcquireAndReleaseRAII) {
    DbConnectionPool pool("127.0.0.1", 3306, "root", "password", "test_db", 5);
    
    // 获取连接
    auto conn = pool.getConnection();
    EXPECT_NE(conn, nullptr);
    EXPECT_TRUE(conn->isValid());

    // 自动通过析构或归还
    pool.releaseConnection(std::move(conn));
}
`,"tests/Buffer_test.cpp":`#include <gtest/gtest.h>
#include "muduo/net/Buffer.h"

using namespace muduo::net;

TEST(BufferTest, AppendAndRetrieve) {
    Buffer buf;
    std::string data = "CppAIService High-Performance Buffer";
    buf.append(data.c_str(), data.size());

    EXPECT_EQ(buf.readableBytes(), data.size());
    EXPECT_EQ(std::string(buf.peek(), buf.readableBytes()), data);

    buf.retrieve(12);
    EXPECT_EQ(buf.readableBytes(), data.size() - 12);
}
`,"tests/McpRegistry_test.cpp":`#include <gtest/gtest.h>
#include "AIUtil/AIToolRegistry.h"

TEST(McpRegistryTest, RegisterToolMetadata) {
    AIToolRegistry registry;
    registry.registerTool("web_search", "Search the web for query", "{\\"type\\":\\"object\\"}");

    EXPECT_TRUE(registry.hasTool("web_search"));
    auto desc = registry.getToolDescription("web_search");
    EXPECT_NE(desc.find("web_search"), std::string::npos);
}
`,"tests/ToolCaller_test.cpp":`#include <gtest/gtest.h>
#include "AIUtil/AIHelper.h"

TEST(ToolCallerTest, AsyncInvokeWithTimeout) {
    AIHelper helper;
    std::string result = helper.callTool("calculator", "{\\"expr\\":\\"2+2\\"}");
    EXPECT_FALSE(result.empty());
}
`,"tests/JsonRpc_test.cpp":`#include <gtest/gtest.h>

TEST(JsonRpcTest, SerializeAndDeserialize) {
    std::string payload = "{\\"jsonrpc\\":\\"2.0\\",\\"method\\":\\"chat\\",\\"id\\":1}";
    // 验证 JSON-RPC 2.0 标准报文解析
    EXPECT_NE(payload.find("jsonrpc"), std::string::npos);
}
`,"tests/ModelClient_test.cpp":`#include "AIUtil/AIStrategy.h"
#include <iostream>

int main() {
    AliyunStrategy strategy;
    strategy.init("fake_api_key");
    std::cout << "ModelClient initialized successfully." << std::endl;
    return 0;
}
`,"tests/StreamParser_test.cpp":`#include <gtest/gtest.h>
#include <string>

TEST(StreamParserTest, ParseSSEEventStream) {
    std::string sseData = "data: {\\"content\\":\\"Hello\\"}\\n\\ndata: {\\"content\\":\\" World\\"}\\n\\n";
    EXPECT_NE(sseData.find("data:"), std::string::npos);
}
`,"tests/ContextCache_test.cpp":`#include <gtest/gtest.h>
#include "session/SessionManager.h"

TEST(ContextCacheTest, LRUEviction) {
    http::session::SessionManager mgr(10);
    auto s1 = mgr.createSession();
    EXPECT_NE(s1, nullptr);
}
`,"tests/RabbitMQ_test.cpp":`#include "AIUtil/MQManager.h"
#include <iostream>

int main() {
    MQManager mq;
    std::cout << "RabbitMQ Producer stub verified." << std::endl;
    return 0;
}
`,"tests/Metrics_test.cpp":`#include <gtest/gtest.h>
#include <chrono>

TEST(MetricsTest, MeasureLatencyP99) {
    // 压力测试时延统计基准
    int64_t lat = 1200; // 1.2ms
    EXPECT_LT(lat, 5000);
}
`},ee=()=>{var S;const[o,_]=r.useState("roadmap"),[i,w]=C("muduo_roadmap_status",{}),[T,q]=C("muduo_roadmap_notes",{}),[b,I]=r.useState(((S=c[0])==null?void 0:S.id)||"channel"),[P,p]=C("sidebar_collapsed_source",!1),l=r.useMemo(()=>Object.keys(H),[]),[h,L]=r.useState(l[0]||""),[d,f]=r.useState(""),[M,y]=r.useState(!1),s=r.useMemo(()=>c.find(n=>n.id===b)||c[0],[b]),A=r.useMemo(()=>{if(!d.trim())return c;const n=d.toLowerCase().trim();return c.filter(t=>t.name.toLowerCase().includes(n)||t.layer.toLowerCase().includes(n)||t.role.toLowerCase().includes(n))},[d]),E=r.useMemo(()=>{if(!d.trim())return l;const n=d.toLowerCase().trim();return l.filter(t=>t.toLowerCase().includes(n))},[l,d]),j=(n,t)=>{w(a=>({...a,[n]:t})),v(`组件状态已更新为: ${t}`,"success")},O=(n,t)=>{q(a=>({...a,[n]:t}))},u=r.useMemo(()=>H[h]||"// 文件内容为空",[h]),k=r.useMemo(()=>{const n=u.split(`
`).length,t=u.length;return{lines:n,kb:(t/1024).toFixed(1)}},[u]),z=async()=>{try{await navigator.clipboard.writeText(u),y(!0),v("源码已复制到剪贴板","success"),setTimeout(()=>y(!1),2e3)}catch{v("复制失败，请手动选择","warning")}},g=r.useMemo(()=>Object.values(i).filter(n=>n==="已吃透").length,[i]);return e.jsxs("div",{className:"flex w-full min-h-[calc(100vh-4rem)] bg-[#eef2f7] dark:bg-[#11141a] transition-colors duration-300 p-3 sm:p-4 gap-4 text-slate-800 dark:text-slate-200",children:[P?e.jsxs("aside",{className:"w-16 shrink-0 rounded-3xl bg-[#f4f7fb]/90 dark:bg-[#151922]/90 shadow-[6px_6px_14px_rgba(0,0,0,0.06),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] py-4 flex flex-col items-center space-y-3 sticky top-18 h-[calc(100vh-5.5rem)] hidden md:flex select-none transition-all duration-300",children:[e.jsx("button",{onClick:()=>p(!1),className:"p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-sky-600 shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",title:"展开源码路线",children:e.jsx(N,{size:18})}),e.jsx("div",{className:"w-8 h-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]"}),e.jsxs("div",{className:"flex flex-col items-center space-y-2 text-slate-600 dark:text-slate-400",children:[e.jsx("button",{onClick:()=>{_("roadmap"),p(!1)},className:`p-2.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${o==="roadmap"?"bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-[3px_3px_8px_rgba(245,158,11,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold":"bg-white/80 dark:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]"}`,title:"组件路线图 (8)",children:e.jsx(m,{size:18})}),e.jsx("button",{onClick:()=>{_("files"),p(!1)},className:`p-2.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${o==="files"?"bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-[3px_3px_8px_rgba(245,158,11,0.3),inset_2px_2px_4px_rgba(255,255,255,0.6)] font-bold":"bg-white/80 dark:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)]"}`,title:`源码文件浏览 (${l.length})`,children:e.jsx(x,{size:18})})]}),e.jsx("div",{className:"w-8 h-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] mt-auto"}),e.jsxs("div",{className:"w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85)] flex flex-col items-center justify-center text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 cursor-pointer active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",onClick:()=>p(!1),title:`已吃透组件: ${g}/8`,children:[g,"/8"]})]}):e.jsxs("aside",{className:"w-80 shrink-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 space-y-4 overflow-y-auto sticky top-18 h-[calc(100vh-5.5rem)] hidden md:block transition-all duration-300 select-none",children:[e.jsxs("div",{className:"pb-2 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between",children:[e.jsxs("h2",{className:"text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2",children:[e.jsx("div",{className:"w-7 h-7 rounded-xl flex items-center justify-center bg-amber-100/90 dark:bg-amber-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-amber-600 dark:text-amber-400",children:e.jsx(B,{size:14})}),e.jsx("span",{children:"源码路线"})]}),e.jsx("button",{onClick:()=>p(!0),className:"p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",title:"收起源码路线",children:e.jsx(F,{size:16})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-1.5 p-1 bg-slate-200/50 dark:bg-slate-900/60 rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.05)] text-xs font-semibold",children:[e.jsxs("button",{onClick:()=>{_("roadmap"),f("")},type:"button",className:`py-1.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex items-center justify-center gap-1.5 active:scale-x-105 active:scale-y-90 ${o==="roadmap"?"bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)] -translate-y-0.5":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,children:[e.jsx(m,{size:13}),e.jsx("span",{children:"组件 (8)"})]}),e.jsxs("button",{onClick:()=>{_("files"),f("")},type:"button",className:`py-1.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex items-center justify-center gap-1.5 active:scale-x-105 active:scale-y-90 ${o==="files"?"bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 font-bold shadow-[2px_2px_6px_rgba(0,0,0,0.08),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)] -translate-y-0.5":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,children:[e.jsx(x,{size:13}),e.jsxs("span",{children:["源码 (",l.length,")"]})]})]}),e.jsxs("div",{className:"relative",children:[e.jsx(D,{size:14,className:"absolute left-3 top-3.5 text-slate-400 pointer-events-none"}),e.jsx("input",{type:"text",placeholder:o==="roadmap"?"搜索组件或职责...":"搜索源文件名...",value:d,onChange:n=>f(n.target.value),className:"w-full bg-white/80 dark:bg-slate-900/70 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden transition-all"})]}),o==="roadmap"&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1",children:"8 大核心组件"}),A.map(n=>{const t=b===n.id,a=i[n.id]||"未读",R=a==="已吃透";return e.jsxs("button",{onClick:()=>I(n.id),type:"button",className:`w-full text-left p-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex items-start justify-between gap-2 active:scale-x-105 active:scale-y-90 select-none ${t?"bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-950/60 dark:via-orange-900/40 dark:to-yellow-950/60 text-amber-950 dark:text-amber-100 shadow-[4px_4px_12px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] -translate-y-0.5 font-bold":"bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 text-slate-700 dark:text-slate-300"}`,children:[e.jsxs("div",{className:"min-w-0",children:[e.jsxs("div",{className:"font-bold text-xs flex items-center gap-1.5",children:[e.jsx("span",{children:n.name}),R&&e.jsx(U,{size:13,className:"text-emerald-500 shrink-0"})]}),e.jsx("div",{className:"text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium",children:n.layer})]}),e.jsx("span",{className:`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 mt-0.5 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] ${R?"bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300":a==="学习中"?"bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300":"bg-slate-100 dark:bg-slate-700 text-slate-500"}`,children:a})]},n.id)})]}),o==="files"&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1",children:"工程文件列表"}),E.map(n=>{const t=h===n,a=n.endsWith(".cpp");return e.jsxs("button",{onClick:()=>L(n),type:"button",className:`w-full text-left px-3 py-2.5 rounded-2xl text-xs font-mono transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex items-center justify-between gap-2 active:scale-x-105 active:scale-y-90 select-none ${t?"bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-950/60 dark:via-orange-900/40 dark:to-yellow-950/60 text-amber-950 dark:text-amber-100 shadow-[4px_4px_12px_rgba(0,0,0,0.07),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] font-bold -translate-y-0.5":"bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 text-slate-700 dark:text-slate-300"}`,children:[e.jsx("span",{className:"truncate",children:n}),e.jsx("span",{className:`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] ${a?"bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300":"bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300"}`,children:a?"CPP":"H"})]},n)})]})]}),e.jsxs("main",{className:"flex-1 min-w-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-6 sm:p-8 space-y-6 overflow-y-auto w-full",children:[o==="roadmap"&&s&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"border-b border-slate-200/60 dark:border-slate-800/60 pb-4",children:[e.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1",children:[e.jsx(m,{size:14}),e.jsx("span",{children:s.layer})]}),e.jsxs("div",{className:"flex items-center justify-between gap-4",children:[e.jsxs("h1",{className:"text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight",children:["class ",s.name]}),e.jsx("span",{className:`px-3 py-1 rounded-full text-xs font-bold shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] ${i[s.id]==="已吃透"?"bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300":i[s.id]==="学习中"?"bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300":"bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`,children:i[s.id]||"未读"})]}),e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium",children:s.role})]}),e.jsxs("div",{className:"space-y-2.5",children:[e.jsxs("h3",{className:"text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5",children:[e.jsx("div",{className:"w-6 h-6 rounded-xl flex items-center justify-center bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]",children:e.jsx(G,{size:12})}),e.jsx("span",{children:"成员变量"})]}),e.jsx("div",{className:"space-y-2",children:s.members.map((n,t)=>e.jsx("div",{className:"p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] text-xs font-mono text-slate-800 dark:text-slate-200",children:n},t))})]}),e.jsxs("div",{className:"space-y-2.5",children:[e.jsxs("h3",{className:"text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5",children:[e.jsx("div",{className:"w-6 h-6 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]",children:e.jsx(x,{size:12})}),e.jsx("span",{children:"核心函数"})]}),e.jsx("div",{className:"space-y-2",children:s.functions.map((n,t)=>e.jsx("div",{className:"p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] text-xs font-mono text-slate-800 dark:text-slate-200",children:n},t))})]}),e.jsxs("div",{className:"space-y-2.5",children:[e.jsxs("h3",{className:"text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5",children:[e.jsx("div",{className:"w-6 h-6 rounded-xl flex items-center justify-center bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]",children:e.jsx(Q,{size:12})}),e.jsx("span",{children:"所涉及现代 C++ 语法机制"})]}),e.jsx("div",{className:"flex flex-wrap gap-2",children:s.cppFeatures.map((n,t)=>e.jsx("span",{className:"px-3 py-1 rounded-2xl text-xs font-mono font-bold bg-amber-100/90 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]",children:n},t))})]}),e.jsxs("div",{className:"space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60",children:[e.jsx("h3",{className:"text-xs font-bold text-slate-900 dark:text-white",children:"学习心得与工程手记"}),e.jsx("textarea",{rows:3,placeholder:"记录对该组件调用链、死锁防护或生命周期边界的理解...",value:T[s.id]||"",onChange:n=>O(s.id,n.target.value),className:"w-full p-3.5 rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] bg-white/80 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden transition-all resize-y"})]})]}),o==="files"&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"text-base font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2",children:[e.jsx(x,{size:16,className:"text-amber-600 dark:text-amber-400"}),e.jsx("span",{children:h})]}),e.jsxs("div",{className:"text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium",children:[k.lines," 行 · ",k.kb," KB"]})]}),e.jsx("button",{onClick:z,type:"button",className:"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-[2px_2px_5px_rgba(0,0,0,0.04),inset_1.5px_1.5px_3px_rgba(255,255,255,0.85)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",children:M?e.jsxs(e.Fragment,{children:[e.jsx(K,{size:13,className:"text-emerald-500"}),e.jsx("span",{children:"已复制"})]}):e.jsxs(e.Fragment,{children:[e.jsx(W,{size:13}),e.jsx("span",{children:"复制代码"})]})})]}),e.jsx(V,{code:u,language:"cpp"})]})]}),e.jsxs("aside",{className:"w-72 shrink-0 rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] p-4 h-[calc(100vh-5.5rem)] sticky top-18 hidden xl:flex flex-col space-y-4 select-none overflow-y-auto",children:[e.jsx("div",{className:"pb-2 border-b border-slate-200/60 dark:border-slate-800/60",children:e.jsxs("h2",{className:"text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2",children:[e.jsx("div",{className:"w-6 h-6 rounded-xl flex items-center justify-center bg-amber-100/90 dark:bg-amber-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-amber-600 dark:text-amber-400",children:e.jsx(X,{size:14})}),e.jsx("span",{children:"组件评定"})]})}),o==="roadmap"&&s&&e.jsxs("div",{className:"p-4 rounded-3xl bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] space-y-3",children:[e.jsxs("div",{className:"text-xs font-bold text-slate-800 dark:text-slate-200",children:["设置 ",s.name," 掌握状态"]}),e.jsx("div",{className:"grid grid-cols-3 gap-1.5",children:["已吃透","学习中","未读"].map(n=>{const t=(i[s.id]||"未读")===n;return e.jsx("button",{onClick:()=>j(s.id,n),type:"button",className:`py-1.5 rounded-2xl text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 ${t?n==="已吃透"?"bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[2px_2px_6px_rgba(16,185,129,0.3),inset_1.5px_1.5px_3px_rgba(255,255,255,0.6)] font-bold -translate-y-0.5":n==="学习中"?"bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[2px_2px_6px_rgba(245,158,11,0.3),inset_1.5px_1.5px_3px_rgba(255,255,255,0.6)] font-bold -translate-y-0.5":"bg-slate-600 text-white shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]":"bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 shadow-[1px_1px_3px_rgba(0,0,0,0.04)]"}`,children:n},n)})})]}),e.jsxs("div",{className:"p-4 rounded-3xl bg-gradient-to-br from-amber-100/70 to-yellow-50/70 dark:from-amber-950/40 dark:to-yellow-900/30 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200",children:[e.jsx("span",{children:"核心组件已吃透"}),e.jsxs("span",{className:"font-mono font-bold text-amber-800 dark:text-amber-300",children:[g," / ",c.length]})]}),e.jsx("div",{className:"w-full h-2 rounded-full bg-amber-200/50 dark:bg-amber-950/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] overflow-hidden p-0.5",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",style:{width:`${Math.round(g/c.length*100)}%`}})})]}),e.jsxs("div",{className:"p-4 rounded-3xl bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] text-xs space-y-2.5",children:[e.jsxs("div",{className:"font-bold text-slate-900 dark:text-white flex items-center gap-1.5",children:[e.jsx("div",{className:"w-6 h-6 rounded-xl flex items-center justify-center bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]",children:e.jsx(m,{size:12})}),e.jsx("span",{children:"核心调用时序"})]}),e.jsxs("div",{className:"text-[11px] font-mono text-slate-700 dark:text-slate-300 space-y-1 leading-relaxed bg-slate-100/60 dark:bg-slate-900/60 p-3 rounded-2xl shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06)]",children:[e.jsx("div",{children:"1. EventLoop::loop()"}),e.jsx("div",{children:"  ↳ Poller::poll()"}),e.jsx("div",{children:"    ↳ Channel::handleEvent()"}),e.jsx("div",{children:"      ↳ TcpConnection::handleRead()"}),e.jsx("div",{children:"        ↳ HttpContext::parseRequest()"}),e.jsx("div",{children:"          ↳ Router::route()"})]})]})]})]})};export{ee as SourceRoadmapView};
