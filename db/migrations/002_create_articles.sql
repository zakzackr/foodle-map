-- articlesテーブル初期化用のSQL
-- TODO: imageURLsの管理方法。別テーブルorJSON
CREATE TABLE articles (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    like_count INTEGER DEFAULT 0 CHECK (like_count >= 0),
    stock_count INTEGER DEFAULT 0 CHECK (stock_count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- triggerを作成
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
