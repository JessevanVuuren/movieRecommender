type = "application/ld+json"
class = "yoast-schema-graph" > {
    "@context": "https://schema.org",
    "@graph": [{
        "@type": "Organization",
        "@id": "https://ibuyitryipost.com/#organization",
        "name": "I Buy I Try I Post",
        "url": "https://ibuyitryipost.com/",
        "sameAs": ["https://www.facebook.com/itryibuyipost"],
        "logo": {
            "@type": "ImageObject",
            "@id": "https://ibuyitryipost.com/#logo",
            "inLanguage": "en-US",
            "url": "https://ibuyitryipost.com/wp-content/uploads/2020/08/ibuyitryipost-logo.png",
            "width": 500,
            "height": 500,
            "caption": "I Buy I Try I Post"
        },
        "image": {
            "@id": "https://ibuyitryipost.com/#logo"
        }
    }, {
        "@type": "WebSite",
        "@id": "https://ibuyitryipost.com/#website",
        "url": "https://ibuyitryipost.com/",
        "name": "~i buy i try i post~",
        "description": "Food &amp; Travel Reviews in Indonesia",
        "publisher": {
            "@id": "https://ibuyitryipost.com/#organization"
        },
        "potentialAction": [{
            "@type": "SearchAction",
            "target": "https://ibuyitryipost.com/?s={search_term_string}",
            "query-input": "required name=search_term_string"
        }],
        "inLanguage": "en-US"
    }, {
        "@type": "CollectionPage",
        "@id": "https://ibuyitryipost.com/#webpage",
        "url": "https://ibuyitryipost.com/",
        "name": "~i buy i try i post~ | Food &amp; Travel Reviews in Indonesia",
        "isPartOf": {
            "@id": "https://ibuyitryipost.com/#website"
        },
        "about": {
            "@id": "https://ibuyitryipost.com/#organization"
        },
        "description": "Food &amp; Travel Reviews in Indonesia",
        "inLanguage": "en-US",
        "potentialAction": [{
            "@type": "ReadAction",
            "target": ["https://ibuyitryipost.com/"]
        }]
    }]
}