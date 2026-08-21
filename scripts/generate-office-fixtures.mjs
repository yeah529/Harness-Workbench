/**
 * One-shot generator for the real OOXML fixtures used by parse-chunk.test.js.
 *
 * Each fixture is a genuine Office Open XML package (a PK ZIP archive) built
 * with fflate (already present as an officeparser dependency): a minimal but
 * schema-valid set of parts ([Content_Types].xml, package relationships, and
 * the document/slide/sheet parts officeparser actually reads). They contain
 * Chinese text so the parser's UTF-8 path is exercised, not a renamed .txt.
 *
 * Regenerate with:  node scripts/generate-office-fixtures.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { zipSync, strToU8 } from "fflate";

const fixturesDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "test", "fixtures");

const XML_DECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const PKG_REL = "http://schemas.openxmlformats.org/package/2006/relationships";
const PKG_CT = "http://schemas.openxmlformats.org/package/2006/content-types";
const DOC_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const WORD = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const PRES = "http://schemas.openxmlformats.org/presentationml/2006/main";
const DRAW = "http://schemas.openxmlformats.org/drawingml/2006/main";
const SHEET = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";

/** Pack an object of { path: xmlString } into a PK ZIP archive. */
function zip(parts) {
  const files = {};
  for (const [path, xml] of Object.entries(parts)) files[path] = strToU8(xml);
  return Buffer.from(zipSync(files));
}

// --- sample.docx -------------------------------------------------------------
const docx = zip({
  "[Content_Types].xml":
    XML_DECL + '<Types xmlns="' + PKG_CT + '"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
  "_rels/.rels":
    XML_DECL + '<Relationships xmlns="' + PKG_REL + '"><Relationship Id="rId1" Type="' + DOC_REL + '/officeDocument" Target="word/document.xml"/></Relationships>',
  "word/document.xml":
    XML_DECL + '<w:document xmlns:w="' + WORD + '"><w:body>' +
      '<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>第一章 概述</w:t></w:r></w:p>' +
      '<w:p><w:r><w:t>这是第一段中文内容。</w:t></w:r></w:p>' +
      '<w:p><w:r><w:t>赛博朋克工作台知识库</w:t></w:r></w:p>' +
      '<w:tbl>' +
        '<w:tr><w:tc><w:p><w:r><w:t>表头甲</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>表头乙</w:t></w:r></w:p></w:tc></w:tr>' +
        '<w:tr><w:tc><w:p><w:r><w:t>数据一</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>数据二</w:t></w:r></w:p></w:tc></w:tr>' +
      '</w:tbl>' +
    '</w:body></w:document>',
});

// --- sample.pptx -------------------------------------------------------------
const pptx = zip({
  "[Content_Types].xml":
    XML_DECL + '<Types xmlns="' + PKG_CT + '"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/><Override PartName="/ppt/slides/slide2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/></Types>',
  "_rels/.rels":
    XML_DECL + '<Relationships xmlns="' + PKG_REL + '"><Relationship Id="rId1" Type="' + DOC_REL + '/officeDocument" Target="ppt/presentation.xml"/></Relationships>',
  "ppt/presentation.xml":
    XML_DECL + '<p:presentation xmlns:p="' + PRES + '" xmlns:r="' + DOC_REL + '"><p:sldIdLst><p:sldId id="256" r:id="rId1"/><p:sldId id="257" r:id="rId2"/></p:sldIdLst></p:presentation>',
  "ppt/_rels/presentation.xml.rels":
    XML_DECL + '<Relationships xmlns="' + PKG_REL + '"><Relationship Id="rId1" Type="' + DOC_REL + '/slide" Target="slides/slide1.xml"/><Relationship Id="rId2" Type="' + DOC_REL + '/slide" Target="slides/slide2.xml"/></Relationships>',
  "ppt/slides/slide1.xml":
    XML_DECL + '<p:sld xmlns:p="' + PRES + '" xmlns:a="' + DRAW + '"><p:cSld><p:spTree><p:sp><p:txBody><a:bodyPr/><a:p><a:r><a:t>第一页标题</a:t></a:r></a:p><a:p><a:r><a:t>第一页正文内容</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>',
  "ppt/slides/slide2.xml":
    XML_DECL + '<p:sld xmlns:p="' + PRES + '" xmlns:a="' + DRAW + '"><p:cSld><p:spTree><p:sp><p:txBody><a:bodyPr/><a:p><a:r><a:t>第二页标题</a:t></a:r></a:p><a:p><a:r><a:t>第二页正文内容</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>',
});

// --- sample.xlsx -------------------------------------------------------------
const xlsx = zip({
  "[Content_Types].xml":
    XML_DECL + '<Types xmlns="' + PKG_CT + '"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
  "_rels/.rels":
    XML_DECL + '<Relationships xmlns="' + PKG_REL + '"><Relationship Id="rId1" Type="' + DOC_REL + '/officeDocument" Target="xl/workbook.xml"/></Relationships>',
  "xl/workbook.xml":
    XML_DECL + '<workbook xmlns="' + SHEET + '" xmlns:r="' + DOC_REL + '"><sheets><sheet name="项目计划" sheetId="1" r:id="rId1"/></sheets></workbook>',
  "xl/_rels/workbook.xml.rels":
    XML_DECL + '<Relationships xmlns="' + PKG_REL + '"><Relationship Id="rId1" Type="' + DOC_REL + '/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
  "xl/worksheets/sheet1.xml":
    XML_DECL + '<worksheet xmlns="' + SHEET + '"><sheetData>' +
      '<row r="1"><c r="A1" t="inlineStr"><is><t xml:space="preserve">任务</t></is></c><c r="B1" t="inlineStr"><is><t xml:space="preserve">负责人</t></is></c></row>' +
      '<row r="2"><c r="A2" t="inlineStr"><is><t xml:space="preserve">渗透测试</t></is></c><c r="B2" t="inlineStr"><is><t xml:space="preserve">V</t></is></c></row>' +
      '<row r="3"><c r="A3" t="inlineStr"><is><t xml:space="preserve">数据整理</t></is></c><c r="B3" t="inlineStr"><is><t xml:space="preserve">朱迪</t></is></c></row>' +
    '</sheetData></worksheet>',
});

mkdirSync(fixturesDir, { recursive: true });
writeFileSync(resolve(fixturesDir, "sample.docx"), docx);
writeFileSync(resolve(fixturesDir, "sample.pptx"), pptx);
writeFileSync(resolve(fixturesDir, "sample.xlsx"), xlsx);

console.log("wrote sample.docx (" + docx.length + " bytes)");
console.log("wrote sample.pptx (" + pptx.length + " bytes)");
console.log("wrote sample.xlsx (" + xlsx.length + " bytes)");
