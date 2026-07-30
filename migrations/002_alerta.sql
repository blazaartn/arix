-- Alerts table for questions and comments
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('question', 'comment')),
  target_id VARCHAR(255) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  content TEXT, -- Snapshot of the reported content
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'blocked')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, target_type, target_id) -- One alert per user per target
);

-- Add alert_count column to questions
ALTER TABLE questions ADD COLUMN alert_count INTEGER DEFAULT 0;
ALTER TABLE questions ADD COLUMN is_blocked BOOLEAN DEFAULT false;
ALTER TABLE questions ADD COLUMN blocked_at TIMESTAMP;

-- Add alert_count column to comments
ALTER TABLE comments ADD COLUMN alert_count INTEGER DEFAULT 0;
ALTER TABLE comments ADD COLUMN is_blocked BOOLEAN DEFAULT false;
ALTER TABLE comments ADD COLUMN blocked_at TIMESTAMP;

-- Indexes for performance
CREATE INDEX idx_alerts_target ON alerts(target_type, target_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_questions_is_blocked ON questions(is_blocked);
CREATE INDEX idx_comments_is_blocked ON comments(is_blocked);

-- Trigger to auto-block questions with 3+ alerts
CREATE OR REPLACE FUNCTION check_question_alerts()
RETURNS TRIGGER AS $$
BEGIN
  -- When an alert is inserted for a question
  IF NEW.target_type = 'question' THEN
    -- Update question alert_count
    UPDATE questions SET alert_count = alert_count + 1 WHERE id = NEW.target_id::INTEGER;
    
    -- Check if question should be blocked (3+ alerts)
    IF (SELECT alert_count FROM questions WHERE id = NEW.target_id::INTEGER) >= 3 THEN
      UPDATE questions SET is_blocked = true, blocked_at = NOW() WHERE id = NEW.target_id::INTEGER;
    END IF;
  END IF;
  
  -- When an alert is inserted for a comment
  IF NEW.target_type = 'comment' THEN
    -- Update comment alert_count
    UPDATE comments SET alert_count = alert_count + 1 WHERE id = NEW.target_id::INTEGER;
    
    -- Check if comment should be blocked (3+ alerts)
    IF (SELECT alert_count FROM comments WHERE id = NEW.target_id::INTEGER) >= 3 THEN
      UPDATE comments SET is_blocked = true, blocked_at = NOW() WHERE id = NEW.target_id::INTEGER;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_alerts
AFTER INSERT ON alerts
FOR EACH ROW
EXECUTE FUNCTION check_question_alerts();

-- Function to prevent alerts on already blocked content
CREATE OR REPLACE FUNCTION prevent_alert_on_blocked()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.target_type = 'question' THEN
    IF (SELECT is_blocked FROM questions WHERE id = NEW.target_id::INTEGER) THEN
      RAISE EXCEPTION 'Cette question est déjà bloquée';
    END IF;
  END IF;
  
  IF NEW.target_type = 'comment' THEN
    IF (SELECT is_blocked FROM comments WHERE id = NEW.target_id::INTEGER) THEN
      RAISE EXCEPTION 'Ce commentaire est déjà bloqué';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_alert_on_blocked
BEFORE INSERT ON alerts
FOR EACH ROW
EXECUTE FUNCTION prevent_alert_on_blocked();