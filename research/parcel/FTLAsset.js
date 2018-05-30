const Asset = require('parcel-bundler/src/Asset')
const parse = require('posthtml-parser')
const api = require('posthtml/lib/api')
const urlJoin = require('parcel-bundler/src/utils/urlJoin');
const isURL = require('parcel-bundler/src/utils/is-url');
const render = require('posthtml-render');

class FTLAsset extends Asset {

  constructor (name, pkg, options) {
    super(name, pkg, options)
    this.type = 'ftl'
    this.isAstDirty = false
  }

  async parse (code) {
    let res = parse(code, {lowerCaseAttributeNames: true})
    res.walk = api.walk
    res.match = api.match
    return res
  }

  processSingleDependency(path, opts) {
    let assetPath = this.addURLDependency(path, opts);{
    if (!isURL(assetPath))
      assetPath = urlJoin(this.options.publicURL, assetPath);
    }
    return assetPath;
  }

  collectDependencies () {
    this.ast.walk(node => {
      if (node.attrs) {
        for (let attr in node.attrs) {
          if (node.tag === 'script') {
            node.attrs[attr] = this.processSingleDependency(node.attrs[attr])
            this.isAstDirty = true
          }
        }
      }

      return node
    })
  }

  generate () {
    return this.isAstDirty ? render(this.ast) : this.contents
  }
}

module.exports = FTLAsset
