plugins {
    // Apply the org.jetbrains.kotlin.jvm Plugin to add support for Kotlin.
    id("org.jetbrains.kotlin.js") version "1.4.31"
}

repositories {
    mavenCentral()
    mavenLocal()

}

dependencies {
    implementation("com.github.shakelang.shake:util:0.1.0")
    implementation("com.github.shakelang.shake:lexer:0.1.0")
    implementation("com.github.shakelang.shake:parser:0.1.0")
    implementation("com.github.shakelang.shake:interpreter:0.1.0")
    testImplementation("org.jetbrains.kotlin:kotlin-test")
}

kotlin {
    js {
        browser {
            browser {
                compilations {
                    "main" {
                        packageJson {
                            customField("browser", mapOf( "fs" to false, "path" to false, "os" to false, "readline" to false))
                        }
                        kotlinOptions {
                            moduleKind = "commonjs"
                            sourceMap = true
                            sourceMapEmbedSources = "always"
                        }
                    }
                }
                commonWebpackConfig {
                    cssSupport.enabled = true
                }
            }
        }
    }
}