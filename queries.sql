-- slowest but accurate to words level

EXPLAIN ANALYZE SELECT story_url, count(*) as count
FROM "Comments" 
WHERE ("Comments"."updatedAt" BETWEEN '2018-01-01' AND '2020-07-07') 
AND (to_tsvector('english', comment_text) @@ to_tsquery('english', 'qui')) 
GROUP BY story_url HAVING (count(*) > '1') 
ORDER BY count DESC LIMIT 100;

--Slow & Semi-Accurate Full-Text Search

EXPLAIN ANALYZE SELECT story_url, count(*) as count
FROM "Comments" 
WHERE ("Comments"."updatedAt" BETWEEN '2018-01-01' AND '2020-07-07')  
AND (comment_text LIKE '%ga%') OR  (comment_text LIKE '%qui%')
GROUP BY story_url HAVING (count(*) > '1') 
ORDER BY count DESC LIMIT 100;

--simple version

SELECT story_url, comment_text
FROM "Comments" 
WHERE comment_text LIKE '%ga%'
LIMIT 100;

/*after 
Thus we fill our new column with the tsvector with desired weighting:

UPDATE comments SET tsv_comment_text = setweight(to_tsvector(coalesce(story_title,'')), 'A') 
|| setweight(to_tsvector(coalesce(comment_text,'')), 'B');
view rawweight-comments.sql hosted with ❤ by GitHub
Finally, we create a function, which triggers every time a new comment is added. This is to ensure the proper weighting is always added to the "tsv_comment_text" column:

CREATE FUNCTION comment_text_search_trigger() RETURNS trigger AS $$
begin
  new.tsv_comment_text :=
    setweight(to_tsvector(coalesce(new.story_title,'')), 'A') ||
    setweight(to_tsvector(coalesce(new.comment_text,'')), 'B');
return new;
end
$$ LANGUAGE plpgsql;

- Trigger on update 
CREATE TRIGGER tsvector_comment_text_update BEFORE INSERT OR UPDATE
ON comments FOR EACH ROW EXECUTE PROCEDURE comment_text_search_trigger();


*/

-- fatest and accurate

EXPLAIN ANALYZE SELECT story_url, count(*) as count
FROM "Comments", plainto_tsquery('qui') AS q
WHERE (tsv_comment_text @@ q) AND "Comments"."createdAt" > '2018-01-01' AND "Comments"."createdAt" < '2020-07-07'
GROUP BY story_url HAVING (count(*) > '1') ORDER BY count DESC LIMIT 100;

-- simple version

SELECT story_url, tsv_comment_text
FROM "Comments", plainto_tsquery('qui') as q
WHERE (tsv_comment_text @@ q) LIMIT 100