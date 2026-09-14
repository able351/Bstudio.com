// ======================================================
// BSTUDIO.COM
// ======================================================


// ======================================================
// 1. SUPABASE 설정
// ======================================================

// Supabase 프로젝트를 만든 후 이 두 값을 입력한다.

const SUPABASE_URL =
    "https://raktqtztftjrqwyfvzrh.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_60scRX1seSsQWdWnPcNaTg_9FKBUAUE";


// Supabase 연결
const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ======================================================
// 2. 관리자 설정
// ======================================================

// 나중에 네 Supabase 계정의 UUID를 입력한다.

const ADMIN_ID =
    "ef0d2be6-5dfe-40d6-80f6-eee2502bf8fc";


// Storage Bucket 이름
const BUCKET_NAME =
    "files";


// ======================================================
// 3. HTML 가져오기
// ======================================================

const loginButton =
    document.getElementById(
        "login-button"
    );


const signupButton =
    document.getElementById(
        "signup-button"
    );


const authBox =
    document.getElementById(
        "auth-box"
    );


const authTitle =
    document.getElementById(
        "auth-title"
    );


const authSubmit =
    document.getElementById(
        "auth-submit"
    );


const authCancel =
    document.getElementById(
        "auth-cancel"
    );


const emailInput =
    document.getElementById(
        "email"
    );


const passwordInput =
    document.getElementById(
        "password"
    );


const authMessage =
    document.getElementById(
        "auth-message"
    );


const uploadBox =
    document.getElementById(
        "upload-box"
    );


const fileInput =
    document.getElementById(
        "file-input"
    );


const postTitle =
    document.getElementById(
        "post-title"
    );


const postDescription =
    document.getElementById(
        "post-description"
    );


const uploadButton =
    document.getElementById(
        "upload-button"
    );


const uploadMessage =
    document.getElementById(
        "upload-message"
    );


const postsContainer =
    document.getElementById(
        "posts"
    );


// ======================================================
// 4. 현재 인증 모드
// ======================================================

let authMode = "login";


// ======================================================
// 5. 로그인 버튼
// ======================================================

loginButton.addEventListener(
    "click",
    async () => {

        // 이미 로그인 상태면 로그아웃
        const {
            data: {
                user
            }
        } =
            await supabaseClient.auth.getUser();


        if (user) {

            await supabaseClient.auth.signOut();

            location.reload();

            return;
        }


        // 로그인 창
        authMode = "login";

        authTitle.textContent =
            "로그인";

        authSubmit.textContent =
            "로그인";

        authMessage.textContent =
            "";

        authBox.classList.remove(
            "hidden"
        );

    }
);


// ======================================================
// 6. 회원가입 버튼
// ======================================================

signupButton.addEventListener(
    "click",
    () => {

        authMode = "signup";

        authTitle.textContent =
            "회원가입";

        authSubmit.textContent =
            "회원가입";

        authMessage.textContent =
            "";

        authBox.classList.remove(
            "hidden"
        );

    }
);


// ======================================================
// 7. 닫기
// ======================================================

authCancel.addEventListener(
    "click",
    () => {

        authBox.classList.add(
            "hidden"
        );

    }
);


// ======================================================
// 8. 로그인 / 회원가입
// ======================================================

authSubmit.addEventListener(
    "click",
    async () => {

        const email =
            emailInput.value.trim();


        const password =
            passwordInput.value;


        if (!email || !password) {

            authMessage.textContent =
                "이메일과 비밀번호를 입력하세요.";

            return;
        }


        authMessage.textContent =
            "처리 중...";


        // ------------------------------
        // 회원가입
        // ------------------------------

        if (authMode === "signup") {

            const {
                error
            } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password

                });


            if (error) {

                authMessage.textContent =
                    error.message;

                return;
            }


            authMessage.textContent =
                "회원가입이 완료되었습니다.\n" +
                "이메일 인증이 필요한 경우 이메일을 확인하세요.";

            return;
        }


        // ------------------------------
        // 로그인
        // ------------------------------

        const {
            error
        } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            authMessage.textContent =
                error.message;

            return;
        }


        authMessage.textContent =
            "로그인 성공!";


        authBox.classList.add(
            "hidden"
        );


        updateUserUI();

    }
);


// ======================================================
// 9. 사용자 UI 업데이트
// ======================================================

async function updateUserUI() {

    const {
        data: {
            user
        }
    } =
        await supabaseClient.auth.getUser();


    // ------------------------------
    // 로그아웃 상태
    // ------------------------------

    if (!user) {

        loginButton.textContent =
            "로그인";


        signupButton.classList.remove(
            "hidden"
        );


        uploadBox.classList.add(
            "hidden"
        );


        return;
    }


    // ------------------------------
    // 로그인 상태
    // ------------------------------

    loginButton.textContent =
        "로그아웃";


    signupButton.classList.add(
        "hidden"
    );


    // ------------------------------
    // 관리자 확인
    // ------------------------------

    if (user.id === ADMIN_ID) {

        uploadBox.classList.remove(
            "hidden"
        );

    }

    else {

        uploadBox.classList.add(
            "hidden"
        );

    }

}


// ======================================================
// 10. 파일 업로드
// ======================================================

uploadButton.addEventListener(
    "click",
    async () => {

        const file =
            fileInput.files[0];


        const title =
            postTitle.value.trim();


        const description =
            postDescription.value.trim();


        // ------------------------------
        // 기본 검사
        // ------------------------------

        if (!file) {

            uploadMessage.textContent =
                "파일을 선택하세요.";

            return;
        }


        if (!title) {

            uploadMessage.textContent =
                "제목을 입력하세요.";

            return;
        }


        uploadMessage.textContent =
            "업로드 준비 중...";


        // ------------------------------
        // 로그인 사용자
        // ------------------------------

        const {
            data: {
                user
            }
        } =
            await supabaseClient.auth.getUser();


        if (!user) {

            uploadMessage.textContent =
                "로그인이 필요합니다.";

            return;
        }


        // ------------------------------
        // 관리자 확인
        // ------------------------------

        if (user.id !== ADMIN_ID) {

            uploadMessage.textContent =
                "파일을 게시할 권한이 없습니다.";

            return;
        }


        // ------------------------------
        // 파일 이름 정리
        // ------------------------------

        const safeFileName =
            file.name.replace(
                /[^a-zA-Z0-9가-힣._-]/g,
                "_"
            );


        // 파일 경로
        const filePath =
            crypto.randomUUID()
            + "-"
            + safeFileName;


        uploadMessage.textContent =
            "파일 업로드 중...";


        // ------------------------------
        // Storage 업로드
        // ------------------------------

        const {
            error: uploadError
        } =
            await supabaseClient.storage
                .from(BUCKET_NAME)
                .upload(
                    filePath,
                    file,
                    {
                        cacheControl: "3600",

                        upsert: false,

                        contentType: file.type
                    }
                );


        if (uploadError) {

            uploadMessage.textContent =
                "파일 업로드 실패:\n"
                + uploadError.message;

            return;
        }


        // ------------------------------
        // 공개 URL 가져오기
        // ------------------------------

        const {
            data: publicUrlData
        } =
            supabaseClient.storage
                .from(BUCKET_NAME)
                .getPublicUrl(
                    filePath
                );


        const fileUrl =
            publicUrlData.publicUrl;


        // ------------------------------
        // 게시물 DB 저장
        // ------------------------------

        uploadMessage.textContent =
            "게시물 저장 중...";


        const {
            error: postError
        } =
            await supabaseClient
                .from("posts")
                .insert({

                    title: title,

                    description: description,

                    file_name: file.name,

                    file_url: fileUrl,

                    file_path: filePath,

                    file_size: file.size,

                    mime_type: file.type,

                    author_id: user.id

                });


        // ------------------------------
        // DB 실패
        // ------------------------------

        if (postError) {

            // 업로드된 파일 삭제
            await supabaseClient.storage
                .from(BUCKET_NAME)
                .remove([
                    filePath
                ]);


            uploadMessage.textContent =
                "게시물 저장 실패:\n"
                + postError.message;

            return;
        }


        // ------------------------------
        // 성공
        // ------------------------------

        uploadMessage.textContent =
            "✅ 게시 완료!";


        fileInput.value =
            "";


        postTitle.value =
            "";


        postDescription.value =
            "";


        // 게시물 새로고침
        loadPosts();

    }
);


// ======================================================
// 11. 게시물 가져오기
// ======================================================

async function loadPosts() {

    postsContainer.innerHTML =
        `
        <p class="loading">
            게시물을 불러오는 중...
        </p>
        `;


    const {
        data,
        error
    } =
        await supabaseClient
            .from("posts")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        postsContainer.innerHTML =
            `
            <p>
                게시물을 불러오지 못했습니다.
                <br><br>
                ${escapeHTML(
                    error.message
                )}
            </p>
            `;

        return;
    }


    if (!data || data.length === 0) {

        postsContainer.innerHTML =
            `
            <p class="loading">
                아직 게시물이 없습니다.
            </p>
            `;

        return;
    }


    postsContainer.innerHTML =
        "";


    for (const post of data) {

        const element =
            await createPostElement(
                post
            );


        postsContainer.appendChild(
            element
        );

    }

}


// ======================================================
// 12. 게시물 하나 만들기
// ======================================================

async function createPostElement(
    post
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "post";


    // 날짜
    const date =
        new Date(
            post.created_at
        ).toLocaleString(
            "ko-KR"
        );


    // 미리보기
    let preview = "";


    // ------------------------------
    // 이미지
    // ------------------------------

    if (
        post.mime_type &&
        post.mime_type.startsWith(
            "image/"
        )
    ) {

        preview =
            `
            <img
                class="preview-image"
                src="${escapeAttribute(
                    post.file_url
                )}"
                alt=""
            >
            `;

    }


    // ------------------------------
    // 영상
    // ------------------------------

    else if (
        post.mime_type &&
        post.mime_type.startsWith(
            "video/"
        )
    ) {

        preview =
            `
            <video
                class="preview-video"
                controls
                src="${escapeAttribute(
                    post.file_url
                )}">
            </video>
            `;

    }


    // ------------------------------
    // 오디오
    // ------------------------------

    else if (
        post.mime_type &&
        post.mime_type.startsWith(
            "audio/"
        )
    ) {

        preview =
            `
            <div class="audio-container">

                <audio
                    controls
                    src="${escapeAttribute(
                        post.file_url
                    )}">
                </audio>

            </div>
            `;

    }


    // ------------------------------
    // 게시물 HTML
    // ------------------------------

    article.innerHTML =
        `

        <div class="post-header">

            <h2 class="post-title">
                ${escapeHTML(
                    post.title
                )}
            </h2>


            <div class="post-date">
                ${date}
            </div>

        </div>


        ${preview}


        <div class="post-description">

            ${escapeHTML(
                post.description || ""
            )}

        </div>


        <div class="file-box">

            <div class="file-name">

                📄
                ${escapeHTML(
                    post.file_name
                )}

            </div>


            <div class="file-size">

                ${formatBytes(
                    post.file_size
                )}

            </div>


            <a
                class="download-button"
                href="${escapeAttribute(
                    post.file_url
                )}"
                download
                target="_blank"
            >
                ⬇ 다운로드
            </a>

        </div>


        <div class="comments">

            <div class="comments-title">
                💬 댓글
            </div>


            <div
                class="comment-list"
                id="comments-${post.id}"
            >
                댓글을 불러오는 중...
            </div>


            <div class="comment-form">

                <input
                    class="comment-input"
                    id="comment-input-${post.id}"
                    type="text"
                    placeholder="댓글을 입력하세요."
                >


                <button
                    class="comment-button"
                    onclick="addComment('${post.id}')"
                >
                    등록
                </button>

            </div>

        </div>

        `;


    // 댓글 가져오기
    loadComments(
        post.id,

        article.querySelector(
            `#comments-${post.id}`
        )
    );


    return article;

}


// ======================================================
// 13. 댓글 가져오기
// ======================================================

async function loadComments(
    postId,
    container
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("comments")
            .select("*")
            .eq(
                "post_id",
                postId
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        container.innerHTML =
            `
            <p class="no-comments">
                댓글을 불러오지 못했습니다.
            </p>
            `;

        return;
    }


    if (
        !data ||
        data.length === 0
    ) {

        container.innerHTML =
            `
            <p class="no-comments">
                아직 댓글이 없습니다.
            </p>
            `;

        return;
    }


    container.innerHTML =
        data.map(
            comment =>
                `

                <div class="comment">

                    <span class="comment-user">
                        ${escapeHTML(
                            comment.user_name
                        )}
                    </span>


                    <span class="comment-text">
                        ${escapeHTML(
                            comment.content
                        )}
                    </span>

                </div>

                `
        ).join("");

}


// ======================================================
// 14. 댓글 추가
// ======================================================

async function addComment(
    postId
) {

    // 현재 사용자
    const {
        data: {
            user
        }
    } =
        await supabaseClient.auth.getUser();


    // 로그인 안 했으면
    if (!user) {

        alert(
            "댓글을 작성하려면 로그인하세요."
        );

        return;
    }


    // 입력창
    const input =
        document.getElementById(
            `comment-input-${postId}`
        );


    const content =
        input.value.trim();


    if (!content) {

        return;
    }


    // 이메일에서 표시 이름 생성
    const userName =
        user.email
            ? user.email.split("@")[0]
            : "사용자";


    // DB에 댓글 저장
    const {
        error
    } =
        await supabaseClient
            .from("comments")
            .insert({

                post_id: postId,

                user_id: user.id,

                user_name: userName,

                content: content

            });


    if (error) {

        alert(
            "댓글 등록 실패:\n"
            + error.message
        );

        return;
    }


    input.value =
        "";


    // 게시물 새로고침
    loadPosts();

}


// ======================================================
// 15. 파일 크기 표시
// ======================================================

function formatBytes(
    bytes
) {

    if (
        bytes === 0
    ) {

        return "0 Bytes";

    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
        "TB"
    ];


    const i =
        Math.floor(
            Math.log(bytes)
            /
            Math.log(1024)
        );


    return (
        parseFloat(
            (
                bytes
                /
                Math.pow(
                    1024,
                    i
                )
            ).toFixed(2)
        )
        +
        " "
        +
        units[i]
    );

}


// ======================================================
// 16. HTML 보안 처리
// ======================================================

function escapeHTML(
    text
) {

    return String(text)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


function escapeAttribute(
    text
) {

    return escapeHTML(
        text
    );

}


// ======================================================
// 17. 로그인 상태 감시
// ======================================================

supabaseClient.auth.onAuthStateChange(
    () => {

        updateUserUI();

    }
);


// ======================================================
// 18. 사이트 시작
// ======================================================

updateUserUI();

loadPosts();
