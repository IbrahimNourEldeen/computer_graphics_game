#include <GL/glut.h>
#include <GL/freeglut.h>

void display()
{
    glClearColor(0.7f, 0.7f, 0.7f, 1);
    glClear(GL_COLOR_BUFFER_BIT);

    float margin = 0.3f;

    float start = -1 + margin;
    float end = 1 - margin;

    float boardSize = end - start;
    float cell = boardSize / 8.0f;

    glColor3f(0.0f, 0.0f, 0.0f);

    glBegin(GL_QUADS);
    glVertex2f(start - 0.01f, start - 0.01f);
    glVertex2f(end + 0.01f, start - 0.01f);
    glVertex2f(end + 0.01f, end + 0.01f);
    glVertex2f(start - 0.01f, end + 0.01f);
    glEnd();

    for (int row = 0; row < 8; row++)
    {
        for (int col = 0; col < 8; col++)
        {
            if ((row + col) % 2 == 0)
                glColor3f(1, 1, 1);
            else
                glColor3f(0, 0, 0);

            float x = start + col * cell;
            float y = start + row * cell;

            glBegin(GL_QUADS);
            glVertex2f(x, y);
            glVertex2f(x + cell, y);
            glVertex2f(x + cell, y + cell);
            glVertex2f(x, y + cell);
            glEnd();
        }
    }

    glFlush();
}

int main(int argc, char **argv)
{
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);

    glutInitWindowSize(600, 600);
    glutCreateWindow("Chess Board");

    glutDisplayFunc(display);
    glutMainLoop();
}