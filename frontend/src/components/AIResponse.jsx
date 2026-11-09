
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function AIResponse({ content }) {
    return (
        <div className="ai-response">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    table: ({ node, ...props }) => (
                        <div className="table-responsive my-2">
                            <table
                                className="table table-bordered table-striped table-sm align-middle"
                                {...props}
                            />
                        </div>
                    ),
                }}
            >
                {content || ""}
            </ReactMarkdown>
        </div>
    );
}

export default AIResponse;
