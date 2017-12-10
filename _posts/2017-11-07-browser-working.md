---
layout: post
title:  【转】浏览器的工作原理：新式网络浏览器幕后揭秘
date: 2017-10-31 11:05:13 +0800
categories:
  - JavaScript
---

说明：关于浏览器工作原理之前有一篇非常出名的文章<a href="http://www.w3cplus.com/animation/animation-performance.html © w3cplus.com
">《浏览器的工作原理：新式网络浏览器幕后揭秘》</a>
<br/><br/>

- 目录
{:toc #markdown-toc}


# 简介
<br/>
网络浏览器很可能是使用最广的软件。在这篇入门文章中，我将会介绍它们的幕后工作原理。我们会了解到，从您**在地址栏输入 google.com 直到您在浏览器屏幕上看到 Google 首页的整个过程中都发生了些什么**。


## 我们要讨论的浏览器

目前使用的主流浏览器有五个：Internet Explorer、Firefox、Safari、Chrome 浏览器和 Opera。本文中以开放源代码浏览器为例，即 Firefox、Chrome 浏览器和 Safari（部分开源）。根据 StatCounter 浏览器统计数据，目前（2011 年 8 月）Firefox、Safari 和 Chrome 浏览器的总市场占有率将近 60%。由此可见，如今开放源代码浏览器在浏览器市场中占据了非常坚实的部分。


## 浏览器的主要功能

浏览器的主要功能就是向服务器发出请求，在浏览器窗口中展示您选择的网络资源。这里所说的资源一般是指 HTML 文档，也可以是 PDF、图片或其他的类型。资源的位置由用户使用 URI（统一资源标示符）指定。

浏览器解释并显示 HTML 文件的方式是在 HTML 和 CSS 规范中指定的。这些规范由网络标准化组织 W3C（万维网联盟）进行维护。 
多年以来，各浏览器都没有完全遵从这些规范，同时还在开发自己独有的扩展程序，这给网络开发人员带来了严重的兼容性问题。如今，大多数的浏览器都是或多或少地遵从规范。

浏览器的用户界面有很多彼此相同的元素，其中包括：

- 用来输入 URI 的地址栏
- 前进和后退按钮
- 书签设置选项
- 用于刷新和停止加载当前文档的刷新和停止按钮
- 用于返回主页的主页按钮
奇怪的是，浏览器的用户界面并没有任何正式的规范，这是多年来的最佳实践自然发展以及彼此之间相互模仿的结果。HTML5 也没有定义浏览器必须具有的用户界面元素，但列出了一些通用的元素，例如地址栏、状态栏和工具栏等。当然，各浏览器也可以有自己独特的功能，比如 Firefox 的下载管理器。

## 浏览器的高层结构

浏览器的主要组件为 (1.1)：

**1.用户界面** - 包括地址栏、前进/后退按钮、书签菜单等。除了浏览器主窗口显示的您请求的页面外，其他显示的各个部分都属于用户界面。

**2.浏览器引擎** - 在用户界面和呈现引擎之间传送指令。

**3.呈现引擎** - 负责显示请求的内容。如果请求的内容是 HTML，它就负责解析 HTML 和 CSS 内容，并将解析后的内容显示在屏幕上。

**4.网络** - 用于网络调用，比如 HTTP 请求。其接口与平台无关，并为所有平台提供底层实现。

**5.用户界面后端** - 用于绘制基本的窗口小部件，比如组合框和窗口。其公开了与平台无关的通用接口，而在底层使用操作系统的用户界面方法。

**6.JavaScript 解释器**。用于解析和执行 JavaScript 代码。

**7.数据存储**。这是持久层。浏览器需要在硬盘上保存各种数据，例如 Cookie。新的 HTML 规范 (HTML5) 定义了“网络数据库”，这是一个完整（但是轻便）的浏览器内数据库。

<img class ="img-responsive center-block" src="{{site.url}}/img/layers.png" alt="图：浏览器的主要组件。" title="图：浏览器的主要组件。"  />

值得注意的是，和大多数浏览器不同，Chrome 浏览器的每个标签页都分别对应一个呈现引擎实例。每个标签页都是一个独立的进程。

# 呈现引擎

呈现引擎的作用嘛...当然就是“呈现”了，也就是在浏览器的屏幕上显示请求的内容。

默认情况下，呈现引擎可显示 HTML 和 XML 文档与图片。通过插件（或浏览器扩展程序），还可以显示其他类型的内容；例如，使用 PDF 查看器插件就能显示 PDF 文档。但是在本章中，我们将集中介绍其主要用途：显示使用 CSS 格式化的 HTML 内容和图片。

## 呈现引擎

本文所讨论的浏览器（Firefox、Chrome 浏览器和 Safari）是基于两种呈现引擎构建的。Firefox 使用的是 Gecko，这是 Mozilla 公司“自制”的呈现引擎。而 Safari 和 Chrome 浏览器使用的都是 WebKit。

WebKit 是一种开放源代码呈现引擎，起初用于 Linux 平台，随后由 Apple 公司进行修改，从而支持苹果机和 Windows。有关详情，请参阅 webkit.org。

## 主流程

呈现引擎一开始会**从网络层获取请求文档的内容**，内容的大小一般限制在 8000 个块以内。

然后进行如下所示的基本流程：

<img class ="img-responsive center-block" src="{{site.url}}/img/flow.png" alt="图：呈现引擎的基本流程。" title="图：呈现引擎的基本流程。"  />

呈现引擎将开始**解析 HTML 文档**，并将各标记逐个转化成“内容树”上的 DOM 节点。同时也会**解析外部 CSS 文件以及样式元素中的样式数据**。HTML 中这些带有视觉指令的样式信息将用于创建另一个树结构：**呈现树**。

呈现树包含多个带有视觉属性（如颜色和尺寸）的矩形。这些矩形的排列顺序就是它们将在屏幕上显示的顺序。

呈现树构建完毕之后，进入“布局”处理阶段，也就是为每个节点分配一个应出现在屏幕上的确切坐标。下一个阶段是**绘制 - 呈现引擎会遍历呈现树，由用户界面后端层将每个节点绘制出来**。

需要着重指出的是，这是一个渐进的过程。为达到更好的用户体验，呈现引擎会力求尽快将内容显示在屏幕上。**它不必等到整个 HTML 文档解析完毕之后，就会开始构建呈现树和设置布局**。在不断接收和处理来自网络的其余内容的同时，呈现引擎会将部分内容解析并显示出来。

## 主流程示例
<figure>
   <img class ="img-responsive center-block" src="{{site.url}}/img/webkitflow.png" alt="图：WebKit 主流程" title="图：WebKit 主流程"  />
    <figcaption><span>图</span>：WebKit 主流程</figcaption>
</figure>

<br/><br/>
<figure>
   <img class ="img-responsive center-block" src="{{site.url}}/img/image008.jpg" alt="图：Mozilla 的 Gecko 呈现引擎主流程" title="图：Mozilla 的 Gecko 呈现引擎主流程"  />
    <figcaption><span>图</span>Mozilla 的 Gecko 呈现引擎主流程 (3.6)</figcaption>
</figure>


<br/><br/>
从图 3 和图 4 可以看出，虽然 WebKit 和 Gecko 使用的术语略有不同，但整体流程是基本相同的。

Gecko 将视觉格式化元素组成的树称为“框架树”。每个元素都是一个框架。WebKit 使用的术语是“呈现树”，它由“呈现对象”组成。对于元素的放置，WebKit 使用的术语是“布局”，而 Gecko 称之为“重排”。对于连接 DOM 节点和可视化信息从而创建呈现树的过程，WebKit 使用的术语是“附加”。有一个细微的非语义差别，就是 Gecko 在 HTML 与 DOM 树之间还有一个称为“内容槽”的层，用于生成 DOM 元素。我们会逐一论述流程中的每一部分：

# 解析和 DOM 树构建

## 1.解析 - 综述

解析是呈现引擎中非常重要的一个环节，因此我们要更深入地讲解。首先，来介绍一下解析。

解析文档是指将文档转化成为有意义的结构，也就是可让代码理解和使用的结构。解析得到的结果通常是**代表了文档结构的节点树**，它称作解析树或者语法树。

示例 - 解析 2 + 3 - 1 这个表达式，会返回下面的树：

<figure>
   <img class ="img-responsive center-block" src="{{site.url}}/img/image009.png" alt="图：数学表达式树节点" title="图：数学表达式树节点"  />
    <figcaption><span>图 : </span>数学表达式树节点</figcaption>
</figure>


### 1.语法

解析是以文档所遵循的语法规则（编写文档所用的语言或格式）为基础的。所有可以解析的格式都必须对应确定的语法（由词汇和语法规则构成）。这称为与上下文无关的语法。人类语言并不属于这样的语言，因此无法用常规的解析技术进行解析。

### 2.解析器和词法分析器的组合

解析的过程可以分成两个子过程：词法分析和语法分析。

**词法分析**是将输入内容分割成大量标记的过程。标记是语言中的词汇，即构成内容的单位。在人类语言中，它相当于语言字典中的单词。

**语法分析**是应用语言的语法规则的过程。

解析器通常将解析工作分给以下两个组件来处理：**词法分析器**（有时也称为标记生成器），负责将输入内容分解成一个个有效标记；而**解析器**负责根据语言的语法规则分析文档的结构，从而构建解析树。词法分析器知道如何将无关的字符（比如空格和换行符）分离出来。

<figure>
   <img class ="img-responsive center-block" src="{{site.url}}/img/image011.png" alt="图：从源文档到解析树" title="图：从源文档到解析树"  />
    <figcaption><span>图</span>：从源文档到解析树</figcaption>
</figure>

解析是一个迭代的过程。通常，解析器会向词法分析器请求一个新标记，并尝试将其与某条语法规则进行匹配。如果发现了匹配规则，解析器会将一个对应于该标记的节点添加到解析树中，然后继续请求下一个标记。

如果没有规则可以匹配，解析器就会将标记存储到内部，并继续请求标记，直至找到可与所有内部存储的标记匹配的规则。如果找不到任何匹配规则，解析器就会引发一个异常。这意味着文档无效，包含语法错误。

### 3.翻译

很多时候，解析树还不是最终产品。解析通常是在翻译过程中使用的，而翻译是指将输入文档转换成另一种格式。编译就是这样一个例子。编译器可将源代码编译成机器代码，具体过程是首先将源代码解析成解析树，然后将解析树翻译成机器代码文档。


<figure>
   <img class ="img-responsive center-block" src="{{site.url}}/img/image013.png" alt="图：编译流程" title="图：编译流程"  />
    <figcaption><span>图</span>：编译流程</figcaption>
</figure>


### 4.解析示例

在图 5 中，我们通过一个数学表达式建立了解析树。现在，让我们试着定义一个简单的数学语言，用来演示解析的过程。




词汇：我们用的语言可包含整数、加号和减号。

语法：

构成语言的语法单位是表达式、项和运算符。
我们用的语言可以包含任意数量的表达式。
表达式的定义是：一个“项”接一个“运算符”，然后再接一个“项”。
运算符是加号或减号。
项是一个整数或一个表达式。
让我们分析一下 2 + 3 - 1。 
匹配语法规则的第一个子串是 2，而根据第 5 条语法规则，这是一个项。匹配语法规则的第二个子串是 2 + 3，而根据第 3 条规则（一个项接一个运算符，然后再接一个项），这是一个表达式。下一个匹配项已经到了输入的结束。2 + 3 - 1 是一个表达式，因为我们已经知道 2 + 3 是一个项，这样就符合“一个项接一个运算符，然后再接一个项”的规则。2 + + 不与任何规则匹配，因此是无效的输入。

### 5.词汇和语法的正式定义

词汇通常用正则表达式表示。

例如，我们的示例语言可以定义如下：

```
INTEGER :0|[1-9][0-9]*
PLUS : +
MINUS: - 
```

正如您所看到的，这里用<a href="http://www.regular-expressions.info/">正则表达式</a>给出了整数的定义。
语法通常使用一种称为**BNF**的格式来定义。我们的示例语言可以定义如下：

```
expression :=  term  operation  term
operation :=  PLUS | MINUS
term := INTEGER | expression
```

之前我们说过，如果语言的语法是**与上下文无关的语法**，就可以由常规解析器进行解析。与上下文无关的语法的直观定义就是可以完全用 BNF 格式表达的语法。有关正式定义，请参阅<a href="https://en.wikipedia.org/wiki/Context-free_grammar">关于与上下文无关的语法的维基百科文章。</a>

### 6.词汇和语法的正式定义解析器类型

有两种基本类型的解析器：自上而下解析器和自下而上解析器。直观地来说，自上而下的解析器从语法的高层结构出发，尝试从中找到匹配的结构。而自下而上的解析器从低层规则出发，将输入内容逐步转化为语法规则，直至满足高层规则。

让我们来看看这两种解析器会如何解析我们的示例：

**自上而下的解析器**会从高层的规则开始：首先将 2 + 3 标识为一个表达式，然后将 2 + 3 - 1 标识为一个表达式（标识表达式的过程涉及到匹配其他规则，但是起点是最高级别的规则）。

**自下而上的解析器**将扫描输入内容，找到匹配的规则后，将匹配的输入内容替换成规则。如此继续替换，直到输入内容的结尾。部分匹配的表达式保存在解析器的堆栈中。

 <img class ="img-responsive center-block" src="{{site.url}}/img/img-stack.png" alt="图：编译流程" title="图：编译流程"  />

这种自下而上的解析器称为**移位归约解析器**，因为输入在向右移位（设想有一个指针从输入内容的开头移动到结尾），并且逐渐归约到语法规则上。


### 7.自动生成解析器

有一些工具可以帮助您生成解析器，它们称为**解析器生成器**。您只要向其提供您所用语言的语法（词汇和语法规则），它就会生成相应的解析器。创建解析器需要对解析有深刻理解，而人工创建并优化解析器并不是一件容易的事情，所以解析器生成器是非常实用的。

WebKit 使用了两种非常有名的解析器生成器：用于创建词法分析器的 Flex 以及用于创建解析器的 Bison（您也可能遇到 Lex 和 Yacc 这样的别名）。Flex 的输入是包含标记的正则表达式定义的文件。Bison 的输入是采用 BNF 格式的语言语法规则。

## 2.HTML 解析器

HTML 解析器的任务是将 HTML 标记解析成解析树。

### 1.HTML 语法定义

HTML 的词汇和语法在 W3C 组织创建的规范中进行了定义。当前的版本是 HTML4，HTML5 正在处理过程中。

### 2.非与上下文无关的语法

正如我们在解析过程的简介中已经了解到的，语法可以用 BNF 等格式进行正式定义。

很遗憾，所有的常规解析器都不适用于 HTML（我并不是开玩笑，它们可以用于解析 CSS 和 JavaScript）。HTML 并不能很容易地用解析器所需的与上下文无关的语法来定义。

有一种可以定义 HTML 的正规格式：DTD（Document Type Definition，文档类型定义），但它不是与上下文无关的语法。

这初看起来很奇怪：HTML 和 XML 非常相似。有很多 XML 解析器可以使用。HTML 存在一个 XML 变体 (XHTML)，那么有什么大的区别呢？

区别在于 HTML 的处理更为“宽容”，它允许您省略某些隐式添加的标记，有时还能省略一些起始或者结束标记等等。和 XML 严格的语法不同，HTML 整体来看是一种“软性”的语法。

显然，这种看上去细微的差别实际上却带来了巨大的影响。一方面，这是 HTML 如此流行的原因：它能包容您的错误，简化网络开发。另一方面，这使得它很难编写正式的语法。概括地说，HTML 无法很容易地通过常规解析器解析（因为它的语法不是与上下文无关的语法），也无法通过 XML 解析器来解析。

### 3.HTML DTD

HTML 的定义采用了 DTD 格式。此格式可用于定义 <a href="https://en.wikipedia.org/wiki/Standard_Generalized_Markup_Language">SGML</a>族的语言。它包括所有允许使用的元素及其属性和层次结构的定义。如上文所述，HTML DTD 无法构成与上下文无关的语法。

DTD 存在一些变体。严格模式完全遵守 HTML 规范，而其他模式可支持以前的浏览器所使用的标记。这样做的目的是确保向下兼容一些早期版本的内容。最新的严格模式 DTD 可以在这里找到：<a href="www.w3.org/TR/html4/strict.dtd">www.w3.org/TR/html4/strict.dtd</a>

### 4.DOM

解析器的输出“解析树”是由 DOM 元素和属性节点构成的树结构。DOM 是文档对象模型 (Document Object Model) 的缩写。它是 HTML 文档的对象表示，同时也是外部内容（例如 JavaScript）与 HTML 元素之间的接口。 
解析树的根节点是<a href="https://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core.html#i-Document">Document</a>对象。

DOM 与标记之间几乎是一一对应的关系。比如下面这段标记：

```html
<html>
  <body>
    <p>
      Hello World
    </p>
    <div> <img src="example.png"/></div>
  </body>
</html>
```

 可翻译成如下的 DOM 树：

<figure>
   <img class ="img-responsive center-block" src="{{site.url}}/img/image015.png" alt="图：示例标记的 DOM 树" title="图：示例标记的 DOM 树"  />
    <figcaption><span>图</span>：示例标记的 DOM 树</figcaption>
</figure>


和 HTML 一样，DOM 也是由 W3C 组织指定的。请参见 <a href="www.w3.org/DOM/DOMTR">www.w3.org/DOM/DOMTR</a>。这是关于文档操作的通用规范。其中一个特定模块描述针对 HTML 的元素。HTML 的定义可以在这里找到：<a href="www.w3.org/TR/2003/REC-DOM-Level-2-HTML-20030109/idl-definitions.html">www.w3.org/TR/2003/REC-DOM-Level-2-HTML-20030109/idl-definitions.html</a>。

我所说的树包含 DOM 节点，指的是树是由实现了某个 DOM 接口的元素构成的。浏览器在具体的实现中会有一些供内部使用的其他属性。

### 5.解析算法

我们在之前章节已经说过，HTML 无法用常规的自上而下或自下而上的解析器进行解析。

原因在于：

- 语言的宽容本质。
- 浏览器历来对一些常见的无效 HTML 用法采取包容态度。
- 解析过程需要不断地反复。源内容在解析过程中通常不会改变，但是在 HTML 中，脚本标记如果包含 document.write，就会添加额外的标记，这样解析过程实际上就更改了输入内容。


由于不能使用常规的解析技术，浏览器就创建了自定义的解析器来解析 HTML。

HTML5 规范详细地描述了**解析算法**。此算法由两个阶段组成：标记化和树构建。

标记化是词法分析过程，将输入内容解析成多个标记。HTML 标记包括起始标记、结束标记、属性名称和属性值。

标记生成器识别标记，传递给树构造器，然后接受下一个字符以识别下一个标记；如此反复直到输入的结束。

<figure>
   <img class ="img-responsive center-block" src="{{site.url}}/img/image017.png" alt="图：HTML 解析流程（摘自 HTML5 规范）" title="图：HTML 解析流程（摘自 HTML5 规范）"  />
    <figcaption><span>图</span>：HTML 解析流程（摘自 HTML5 规范）</figcaption>
</figure>



### 6.标记化算法

该算法的**输出结果是 HTML 标记**。该算法使用状态机来表示。每一个状态接收来自输入信息流的一个或多个字符，并根据这些字符更新下一个状态。当前的标记化状态和树结构状态会影响进入下一状态的决定。这意味着，即使接收的字符相同，对于下一个正确的状态也会产生不同的结果，具体取决于当前的状态。该算法相当复杂，无法在此详述，所以我们通过一个简单的示例来帮助大家理解其原理。

基本示例 - 将下面的 HTML 代码标记化：

```html
<html>
  <body>
    Hello world
  </body>
</html>
```

初始状态是**数据状态**。遇到字符 < 时，状态更改为**标记打开状态**。接收一个 a-z 字符会创建**起始标记**，状态更改为**标记名称状态**。这个状态会一直保持到接收 > 字符。在此期间接收的每个字符都会附加到新的标记名称上。在本例中，我们创建的标记是 html 标记。

遇到 > 标记时，会发送当前的标记，状态改回**数据状态**。<body> 标记也会进行同样的处理。目前 html 和 body 标记均已发出。现在我们回到**数据状态**。接收到 Hello world 中的 H 字符时，将创建并发送字符标记，直到接收 </body> 中的 <。我们将为 Hello world 中的每个字符都发送一个字符标记。

现在我们回到**标记打开状态**。接收下一个输入字符 / 时，会创建 end tag token 并改为**标记名称状态**。我们会再次保持这个状态，直到接收 >。然后将发送新的标记，并回到**数据状态**。</html> 输入也会进行同样的处理。


<figure>
   <img class ="img-responsive center-block" src="{{site.url}}/img/image019.png" alt="图：对示例输入进行标记化" title="图：对示例输入进行标记化"  />
    <figcaption><span>图</span>：对示例输入进行标记化</figcaption>
</figure>


### 7.树构建算法

在创建解析器的同时，也会创建 Document 对象。在树构建阶段，以 Document 为根节点的 DOM 树也会不断进行修改，向其中添加各种元素。标记生成器发送的每个节点都会由树构建器进行处理。规范中定义了每个标记所对应的 DOM 元素，这些元素会在接收到相应的标记时创建。这些元素不仅会添加到 DOM 树中，还会添加到开放元素的堆栈中。此堆栈用于纠正嵌套错误和处理未关闭的标记。其算法也可以用状态机来描述。这些状态称为“插入模式”。

让我们来看看示例输入的树构建过程：

<html>
  <body>
    Hello world
  </body>
</html>
树构建阶段的输入是一个来自标记化阶段的标记序列。第一个模式是“initial mode”。接收 HTML 标记后转为“before html”模式，并在这个模式下重新处理此标记。这样会创建一个 HTMLHtmlElement 元素，并将其附加到 Document 根对象上。

然后状态将改为“before head”。此时我们接收“body”标记。即使我们的示例中没有“head”标记，系统也会隐式创建一个 HTMLHeadElement，并将其添加到树中。

现在我们进入了“in head”模式，然后转入“after head”模式。系统对 body 标记进行重新处理，创建并插入 HTMLBodyElement，同时模式转变为“in body”。

现在，接收由“Hello world”字符串生成的一系列字符标记。接收第一个字符时会创建并插入“Text”节点，而其他字符也将附加到该节点。

接收 body 结束标记会触发“after body”模式。现在我们将接收 HTML 结束标记，然后进入“after after body”模式。接收到文件结束标记后，解析过程就此结束。

<figure>
   <img class ="img-responsive center-block" src="{{site.url}}/img/image022.png" alt="图：示例 HTML 的树构建" title="图：示例 HTML 的树构建"  />
    <figcaption><span>图</span>：示例 HTML 的树构建</figcaption>
</figure>
### 8.解析结束后的操作

在此阶段，浏览器会将文档标注为交互状态，并开始解析那些处于“deferred”模式的脚本，也就是那些应在文档解析完成后才执行的脚本。然后，文档状态将设置为“完成”，一个“加载”事件将随之触发。

您可以在<a href="https://www.w3.org/TR/html5/syntax.html#html-parser">HTML5 规范中查看标记化和树构建的完整算法<a>

### 9.浏览器的容错机制

您在浏览 HTML 网页时从来不会看到“语法无效”的错误。这是因为浏览器会纠正任何无效内容，然后继续工作。

以下面的 HTML 代码为例：

<html>
  <mytag>
  </mytag>
  <div>
  <p>
  </div>
    Really lousy HTML
  </p>
</html>
在这里，我已经违反了很多语法规则（“mytag”不是标准的标记，“p”和“div”元素之间的嵌套有误等等），但是浏览器仍然会正确地显示这些内容，并且毫无怨言。因为有大量的解析器代码会纠正 HTML 网页作者的错误。

不同浏览器的错误处理机制相当一致，但令人称奇的是，这种机制并不是 HTML 当前规范的一部分。和书签管理以及前进/后退按钮一样，它也是浏览器在多年发展中的产物。很多网站都普遍存在着一些已知的无效 HTML 结构，每一种浏览器都会尝试通过和其他浏览器一样的方式来修复这些无效结构。

HTML5 规范定义了一部分这样的要求。WebKit 在 HTML 解析器类的开头注释中对此做了很好的概括。

解析器对标记化输入内容进行解析，以构建文档树。如果文档的格式正确，就直接进行解析。

遗憾的是，我们不得不处理很多格式错误的 HTML 文档，所以解析器必须具备一定的容错性。

我们至少要能够处理以下错误情况：

明显不能在某些外部标记中添加的元素。在此情况下，我们应该关闭所有标记，直到出现禁止添加的元素，然后再加入该元素。

我们不能直接添加的元素。这很可能是网页作者忘记添加了其中的一些标记（或者其中的标记是可选的）。这些标签可能包括：HTML HEAD BODY TBODY TR TD LI（还有遗漏的吗？）。

向 inline 元素内添加 block 元素。关闭所有 inline 元素，直到出现下一个较高级的 block 元素。

如果这样仍然无效，可关闭所有元素，直到可以添加元素为止，或者忽略该标记。
让我们看一些 WebKit 容错的示例：

使用了 </br> 而不是 <br>

有些网站使用了 </br> 而不是 <br>。为了与 IE 和 Firefox 兼容，WebKit 将其与 <br> 做同样的处理。 
代码如下：

```javascript
if (t->isCloseTag(brTag) && m_document->inCompatMode()) {
     reportError(MalformedBRError);
     t->beginTag = true;
} 
```

请注意，错误处理是在内部进行的，用户并不会看到这个过程。
离散表格

离散表格是指位于其他表格内容中，但又不在任何一个单元格内的表格。 
比如以下的示例：

```javascript
<table>
    <table>
        <tr><td>inner table</td></tr>
    </table>
    <tr><td>outer table</td></tr>
</table> WebKit 会将其层次结构更改为两个同级表格：
<table>
    <tr><td>outer table</td></tr>
</table>
<table>
    <tr><td>inner table</td></tr>
</table>
```

```javascript
 代码如下：
if (m_inStrayTableContent && localName == tableTag)
        popBlock(tableTag); 
```

WebKit 使用一个堆栈来保存当前的元素内容，它会从外部表格的堆栈中弹出内部表格。现在，这两个表格就变成了同级关系。
嵌套的表单元素

如果用户在一个表单元素中又放入了另一个表单，那么第二个表单将被忽略。 
代码如下：

```javascript
if (!m_currentFormElement) {
        m_currentFormElement = new HTMLFormElement(formTag,    m_document);
}
```

过于复杂的标记层次结构

代码的注释已经说得很清楚了。 
示例网站<a href="www.liceo.edu.mx">www.liceo.edu.mx</a>嵌套了约 1500 个标记，全都来自一堆标记。我们只允许最多 20 层同类型标记的嵌套，如果再嵌套更多，就会全部忽略。

```javascript
bool HTMLParser::allowNestedRedundantTag(const AtomicString& tagName)
{

unsigned i = 0;
for (HTMLStackElem* curr = m_blockStack;
         i < cMaxRedundantTagDepth && curr && curr->tagName == tagName;
     curr = curr->next, i++) { }
return i != cMaxRedundantTagDepth;
}
```

放错位置的 html 或者 body 结束标记

同样，代码的注释已经说得很清楚了。

支持格式非常糟糕的 HTML 代码。我们从不关闭 body 标记，因为一些愚蠢的网页会在实际文档结束之前就关闭。我们通过调用 end() 来执行关闭操作。

```javascript
if (t->tagName == htmlTag || t->tagName == bodyTag )
        return;
```

所以网页作者需要注意，除非您想作为反面教材出现在 WebKit 容错代码段的示例中，否则还请编写格式正确的 HTML 代码。

## 3.CSS 解析

还记得简介中解析的概念吗？和 HTML 不同，CSS 是上下文无关的语法，可以使用简介中描述的各种解析器进行解析。事实上，CSS 规范定义了 CSS 的词法和语法。

让我们来看一些示例： 
词法语法（词汇）是针对各个标记用正则表达式定义的：
||
-|-
comment|\/\*[^*]*\*+([^/*][^*]*\*+)*\/
num|[0-9]+|[0-9]*"."[0-9]+
nonascii|[\200-\377]
nmstart|[_a-z]|{nonascii}|{escape}
nmchar|[_a-z0-9-]|{nonascii}|{escape}
name|{nmchar}+
ident| {nmstart}{nmchar}*


“ident”是标识符 (identifier) 的缩写，比如类名。“name”是元素的 ID（通过“#”来引用）。

语法是采用 BNF 格式描述的。

```
ruleset
  : selector [ ',' S* selector ]*
    '{' S* declaration [ ';' S* declaration ]* '}' S*
  ;
selector
  : simple_selector [ combinator selector | S+ [ combinator? selector ]? ]?
  ;
simple_selector
  : element_name [ HASH | class | attrib | pseudo ]*
  | [ HASH | class | attrib | pseudo ]+
  ;
class
  : '.' IDENT
  ;
element_name
  : IDENT | '*'
  ;
attrib
  : '[' S* IDENT S* [ [ '=' | INCLUDES | DASHMATCH ] S*
    [ IDENT | STRING ] S* ] ']'
  ;
pseudo
  : ':' [ IDENT | FUNCTION S* [IDENT S*] ')' ]
  ; 
```

解释：这是一个规则集的结构：

```
div.error , a.error {
  color:red;
  font-weight:bold;
}
```

 div.error 和 a.error 是选择器。大括号内的部分包含了由此规则集应用的规则。此结构的正式定义是这样的：
ruleset
  : selector [ ',' S* selector ]*
    '{' S* declaration [ ';' S* declaration ]* '}' S*
  ; 这表示一个规则集就是一个选择器，或者由逗号和空格（S 表示空格）分隔的多个（数量可选）选择器。规则集包含了大括号，以及其中的一个或多个（数量可选）由分号分隔的声明。“声明”和“选择器”将由下面的 BNF 格式定义。
WebKit CSS 解析器

WebKit 使用 Flex 和 Bison 解析器生成器，通过 CSS 语法文件自动创建解析器。正如我们之前在解析器简介中所说，Bison 会创建自下而上的移位归约解析器。Firefox 使用的是人工编写的自上而下的解析器。这两种解析器都会将 CSS 文件解析成 StyleSheet 对象，且每个对象都包含 CSS 规则。CSS 规则对象则包含选择器和声明对象，以及其他与 CSS 语法对应的对象。


<figure>
   <img class ="img-responsive center-block" src="{{site.url}}/img/image022.png" alt="图：解析 CSS" title="图：解析 CSS"  />
    <figcaption><span>图</span>：解析 CSS</figcaption>
</figure>



## 4.处理脚本和样式表的顺序

### 1.脚本

网络的模型是同步的。网页作者希望解析器遇到< script>标记时立即解析并执行脚本。文档的解析将停止，直到脚本执行完毕。如果脚本是外部的，那么解析过程会停止，直到从网络同步抓取资源完成后再继续。此模型已经使用了多年，也在 HTML4 和 HTML5 规范中进行了指定。作者也可以将脚本标注为“defer”，这样它就不会停止文档解析，而是等到解析结束才执行。HTML5 增加了一个选项，可将脚本标记为异步，以便由其他线程解析和执行。

### 2.预解析

WebKit 和 Firefox 都进行了这项优化。在执行脚本时，其他线程会解析文档的其余部分，找出并加载需要通过网络加载的其他资源。通过这种方式，资源可以在并行连接上加载，从而提高总体速度。请注意，预解析器不会修改 DOM 树，而是将这项工作交由主解析器处理；预解析器只会解析外部资源（例如外部脚本、样式表和图片）的引用。

### 3.样式表

另一方面，样式表有着不同的模型。理论上来说，应用样式表不会更改 DOM 树，因此似乎没有必要等待样式表并停止文档解析。但这涉及到一个问题，就是脚本在文档解析阶段会请求样式信息。如果当时还没有加载和解析样式，脚本就会获得错误的回复，这样显然会产生很多问题。这看上去是一个非典型案例，但事实上非常普遍。Firefox 在样式表加载和解析的过程中，会禁止所有脚本。而对于 WebKit 而言，仅当脚本尝试访问的样式属性可能受尚未加载的样式表影响时，它才会禁止该脚本。

## 4.呈现树构建

在 DOM 树构建的同时，浏览器还会构建另一个树结构：呈现树。这是由可视化元素按照其显示顺序而组成的树，也是文档的可视化表示。它的作用是让您按照正确的顺序绘制内容。

Firefox 将呈现树中的元素称为“框架”。WebKit 使用的术语是呈现器或呈现对象。 
呈现器知道如何布局并将自身及其子元素绘制出来。 

WebKits RenderObject 类是所有呈现器的基类，其定义如下：

```c++
class RenderObject{
  virtual void layout();
  virtual void paint(PaintInfo);
  virtual void rect repaintRect();
  Node* node;  //the DOM node
  RenderStyle* style;  // the computed style
  RenderLayer* containgLayer; //the containing z-index layer
}
```

每一个呈现器都代表了一个矩形的区域，通常对应于相关节点的 CSS 框，这一点在 CSS2 规范中有所描述。它包含诸如宽度、高度和位置等几何信息。 
框的类型会受到与节点相关的“display”样式属性的影响（请参阅<a href="#Style_Computation">样式计算</a>）。下面这段 WebKit 代码描述了根据 display 属性的不同，针对同一个 DOM 节点应创建什么类型的呈现器。

```c++
RenderObject* RenderObject::createObject(Node* node, RenderStyle* style)
{
    Document* doc = node->document();
    RenderArena* arena = doc->renderArena();
    ...
    RenderObject* o = 0;

    switch (style->display()) {
        case NONE:
            break;
        case INLINE:
            o = new (arena) RenderInline(node);
            break;
        case BLOCK:
            o = new (arena) RenderBlock(node);
            break;
        case INLINE_BLOCK:
            o = new (arena) RenderBlock(node);
            break;
        case LIST_ITEM:
            o = new (arena) RenderListItem(node);
            break;
       ...
    }

    return o;
} 
```

元素类型也是考虑因素之一，例如表单控件和表格都对应特殊的框架。 
在 WebKit 中，如果一个元素需要创建特殊的呈现器，就会替换 createRenderer 方法。呈现器所指向的样式对象中包含了一些和几何无关的信息。

### 1.呈现树和 DOM 树的关系

**呈现器是和 DOM 元素相对应的，但并非一一对应,非可视化的 DOM 元素不会插入呈现树中，例如“head”元素。如果元素的 display 属性值为“none”，那么也不会显示在呈现树中**（但是 visibility 属性值为“hidden”的元素仍会显示）。

有一些 DOM 元素对应多个可视化对象。它们往往是具有复杂结构的元素，无法用单一的矩形来描述。例如，“select”元素有 3 个呈现器：一个用于显示区域，一个用于下拉列表框，还有一个用于按钮。如果由于宽度不够，文本无法在一行中显示而分为多行，那么新的行也会作为新的呈现器而添加。 
另一个关于多呈现器的例子是格式无效的 HTML。根据 CSS 规范，inline 元素只能包含 block 元素或 inline 元素中的一种。如果出现了混合内容，则应创建匿名的 block 呈现器，以包裹 inline 元素。

有一些呈现对象对应于 DOM 节点，但在树中所在的位置与 DOM 节点不同。浮动定位和绝对定位的元素就是这样，它们处于正常的流程之外，放置在树中的其他地方，并映射到真正的框架，而放在原位的是占位框架。

 <figure>
   <img class ="img-responsive center-block" src="{{site.url}}/img/image025.png" alt="图：呈现树及其对应的 DOM 树 (3.1)。初始容器 block 为“viewport”，而在 WebKit 中则为“RenderView”对象。" title="图：呈现树及其对应的 DOM 树 (3.1)。初始容器 block 为“viewport”，而在 WebKit 中则为“RenderView”对象。"  />
    <figcaption><span>图</span>：呈现树及其对应的 DOM 树 (3.1)。初始容器 block 为“viewport”，而在 WebKit 中则为“RenderView”对象。</figcaption>
</figure>


### 2.构建呈现树的流程

在 Firefox 中，系统会针对 DOM 更新注册展示层，作为侦听器。展示层将框架创建工作委托给 FrameConstructor，由该构造器解析样式（请参阅<a href="#Style_Computation">样式计算</a>）并创建框架。

在 WebKit 中，解析样式和创建呈现器的过程称为“附加”。每个 DOM 节点都有一个“attach”方法。附加是同步进行的，将节点插入 DOM 树需要调用新的节点“attach”方法。

处理 html 和 body 标记就会构建呈现树根节点。这个根节点呈现对象对应于 CSS 规范中所说的容器 block，这是最上层的 block，包含了其他所有 block。它的尺寸就是视口，即浏览器窗口显示区域的尺寸。Firefox 称之为 ViewPortFrame，而 WebKit 称之为 RenderView。这就是文档所指向的呈现对象。呈现树的其余部分以 DOM 树节点插入的形式来构建。

请参阅<a href="https://www.w3.org/TR/CSS21/intro.html#processing-model">关于处理模型的 CSS2 规范。</a>

<h3 id="Style_Computation"> 3.样式计算</h3>

构建呈现树时，需要计算每一个呈现对象的可视化属性。这是通过计算每个元素的样式属性来完成的。

样式包括来自各种来源的样式表、inline 样式元素和 HTML 中的可视化属性（例如“bgcolor”属性）。其中后者将经过转化以匹配 CSS 样式属性。

样式表的来源包括浏览器的默认样式表、由网页作者提供的样式表以及由浏览器用户提供的用户样式表（浏览器允许您定义自己喜欢的样式。以 Firefox 为例，用户可以将自己喜欢的样式表放在“Firefox Profile”文件夹下）。

样式计算存在以下难点：

样式数据是一个超大的结构，存储了无数的样式属性，这可能造成内存问题。
如果不进行优化，为每一个元素查找匹配的规则会造成性能问题。要为每一个元素遍历整个规则列表来寻找匹配规则，这是一项浩大的工程。选择器会具有很复杂的结构，这就会导致某个匹配过程一开始看起来很可能是正确的，但最终发现其实是徒劳的，必须尝试其他匹配路径。

例如下面这个组合选择器：

```
div div div div{
  ...
} 
```


未完待续...